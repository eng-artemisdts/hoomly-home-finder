import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MapPin, Loader2, Bed, Bath, Maximize, ExternalLink } from "lucide-react";
import { getNeighborhoodFromItem } from "@/data/apartments";
import { formatPriceBrl } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_CHAT_API_URL ?? "http://localhost:3000";

/** Apartamento retornado pela API /chat */
export interface ChatApartment {
  _id?: string;
  title: string;
  price: number;
  condominio?: number;
  iptu?: number;
  location: string;
  neighborhood?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  petFriendly?: boolean;
  url: string;
  image?: string;
  origin?: string;
}

/** Resposta da API POST /chat */
interface ChatApiResponse {
  answer: string;
  count: number;
  apartments: ChatApartment[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  apartments?: ChatApartment[];
}

/** Extrai quartos do título (ex.: "1 quarto" -> 1). */
function getBedroomsFromTitle(title: string): number {
  const match = /(\d+)\s*quarto/i.exec(title);
  return match ? parseInt(match[1], 10) : 0;
}

/** Dados formatados do apartamento para o card compacto do chat */
function getChatCardData(apt: ChatApartment) {
  const neighborhood =
    apt.neighborhood && apt.neighborhood.length < 80
      ? apt.neighborhood
      : getNeighborhoodFromItem(apt.title, apt.location);
  const shortLocation =
    apt.location && apt.location.length < 80 && apt.location.includes(",")
      ? apt.location
      : `${neighborhood}, Belo Horizonte`;
  const bedrooms = apt.bedrooms ?? getBedroomsFromTitle(apt.title) ?? 0;
  const bathrooms = apt.bathrooms ?? 1;
  const area = apt.area ?? 20;
  const totalPorMes = apt.price + (apt.condominio ?? 0) + (apt.iptu ?? 0);
  const temDetalhe =
    (apt.condominio != null && apt.condominio > 0) || (apt.iptu != null && apt.iptu > 0);
  return {
    address: shortLocation,
    neighborhood: apt.neighborhood ?? neighborhood,
    bedrooms,
    bathrooms,
    area,
    price: apt.price,
    condominio: apt.condominio,
    iptu: apt.iptu,
    totalPorMes,
    temDetalhe,
    url: apt.url,
  };
}

/** Card compacto de apartamento para exibição dentro do chat (qt, bwc, m², preço, detalhamento, endereço) */
function ChatApartmentCard({ apt }: { apt: ChatApartment }) {
  const d = getChatCardData(apt);
  return (
    <div className="rounded-xl border border-border/70 bg-muted/30 p-3 space-y-2.5 text-sm">
      {/* Chips: qt, bwc, m² */}
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 border border-border/60 px-2 py-0.5 text-xs text-foreground">
          <Bed className="h-3 w-3" />
          {d.bedrooms} qt.
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 border border-border/60 px-2 py-0.5 text-xs text-foreground">
          <Bath className="h-3 w-3" />
          {d.bathrooms} bwc
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 border border-border/60 px-2 py-0.5 text-xs text-foreground">
          <Maximize className="h-3 w-3" />
          {d.area}m²
        </span>
      </div>
      {/* Preço por mês (total) */}
      <div>
        <p className="text-base font-bold text-foreground tabular-nums">
          {formatPriceBrl(d.totalPorMes)}
        </p>
        <p className="text-xs text-muted-foreground">
          por mês{d.temDetalhe ? " (total)" : ""}
        </p>
      </div>
      {/* Detalhamento: Aluguel, Condomínio, IPTU */}
      {d.temDetalhe && (
        <div className="rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
            Detalhamento
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
            <span className="text-foreground">
              <span className="text-muted-foreground">Aluguel </span>
              <span className="font-semibold tabular-nums">{formatPriceBrl(d.price)}</span>
            </span>
            {d.condominio != null && d.condominio > 0 && (
              <span className="text-foreground">
                <span className="text-muted-foreground">Condomínio </span>
                <span className="font-semibold tabular-nums">
                  {formatPriceBrl(d.condominio!)}
                </span>
              </span>
            )}
            {d.iptu != null && d.iptu > 0 && (
              <span className="text-foreground">
                <span className="text-muted-foreground">IPTU </span>
                <span className="font-semibold tabular-nums">{formatPriceBrl(d.iptu!)}</span>
              </span>
            )}
          </div>
        </div>
      )}
      {/* Endereço */}
      <div className="flex items-start gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-foreground leading-tight">
          {d.address || d.neighborhood || "—"}
        </p>
      </div>
      {/* Link para anúncio */}
      {d.url && (
        <a
          href={d.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver anúncio no site oficial
        </a>
      )}
    </div>
  );
}

/** Converte markdown simples (bold e links) para HTML seguro */
function formatAnswerToHtml(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:no-underline">$1</a>'
    );
}

const AISearchChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou seu assistente de busca de apartamentos. Me conte o que você procura - bairro, preço, número de quartos, ou qualquer característica importante para você.",
      suggestions: [
        "Liste todos os apartamentos",
        "Apartamentos até 3000 reais",
        "Apartamentos em São Paulo",
        "Apartamentos com 2 quartos",
        "Apartamentos mais baratos",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: messageText }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Erro ${res.status}`);
      }

      const data: ChatApiResponse = await res.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        apartments: data.apartments?.length ? data.apartments : undefined,
        suggestions:
          data.apartments?.length > 0
            ? ["Ordenar por preço", "Ver mais opções", "Filtrar por bairro"]
            : undefined,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível conectar à API. Verifique se o servidor está rodando em " +
            API_BASE;
      setError(message);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Desculpe, ocorreu um erro: ${message}. Confira se a API está ativa em \`${API_BASE}\`.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Busca Inteligente</h3>
            <p className="text-xs text-muted-foreground">
              Descreva o apartamento ideal para você
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            <div
              className={`max-w-[85%] w-full ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3"
                  : "bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    Hoomly AI
                  </span>
                </div>
              )}
              {message.role === "user" ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-primary-foreground">
                  {message.content}
                </p>
              ) : (
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: formatAnswerToHtml(message.content),
                  }}
                />
              )}

              {/* Lista de apartamentos retornados pela API */}
              {message.apartments && message.apartments.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {message.apartments.length} imóveis encontrados
                  </p>
                  <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
                    {message.apartments.map((apt, idx) => (
                      <ChatApartmentCard
                        key={apt._id ?? apt.url ?? idx}
                        apt={apt}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Location Tags */}
      <div className="px-4 py-2 border-t border-border/30 bg-secondary/30">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-muted-foreground shrink-0">
            Populares:
          </span>
          {[
            "Ouro Preto",
            "Paquetá",
            "Belo Horizonte",
            "Santa Terezinha",
            "Serrano",
          ].map((location) => (
            <button
              key={location}
              onClick={() => handleSend(`Apartamentos em ${location}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors shrink-0"
            >
              <MapPin className="h-3 w-3" />
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-card">
        {error && <p className="text-xs text-destructive mb-2">{error}</p>}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Apartamentos até 3000 reais, 2 quartos em Belo Horizonte..."
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border-0 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISearchChat;
