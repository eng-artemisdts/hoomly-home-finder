import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MapPin, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

const AISearchChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! 👋 Sou seu assistente de busca de apartamentos. Me conte o que você procura - bairro, preço, número de quartos, ou qualquer característica importante para você.",
      suggestions: [
        "Apartamento em Pinheiros até R$ 3.500",
        "2 quartos perto do metrô",
        "Aceita pets em Vila Madalena",
        "Studio mobiliado nos Jardins"
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(messageText),
        suggestions: getFollowUpSuggestions(messageText),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("pinheiros")) {
      return "Excelente escolha! 🏠 Encontrei **8 apartamentos** em Pinheiros dentro do seu orçamento. A região tem ótima infraestrutura, próxima ao metrô Faria Lima e com diversos restaurantes. Quer que eu filtre por alguma característica específica?";
    }
    if (lowerQuery.includes("pet") || lowerQuery.includes("cachorro") || lowerQuery.includes("gato")) {
      return "Entendido! 🐕 Busquei apartamentos que aceitam pets. Encontrei **5 opções** em Vila Madalena e Pinheiros. Alguns condomínios têm até área para passeio. Posso mostrar os detalhes?";
    }
    if (lowerQuery.includes("metrô") || lowerQuery.includes("metro")) {
      return "Proximidade ao metrô é muito prático! 🚇 Localizei **12 apartamentos** a menos de 500m de estações. As melhores opções estão nas linhas verde e amarela. Prefere alguma região específica?";
    }
    if (lowerQuery.includes("mobiliado")) {
      return "Apartamentos mobiliados facilitam muito a mudança! 🛋️ Tenho **6 opções** com móveis completos, incluindo eletrodomésticos. Os preços variam de R$ 2.800 a R$ 4.500. Quer ver os mais bem avaliados?";
    }
    if (lowerQuery.includes("studio") || lowerQuery.includes("estúdio")) {
      return "Studios são ótimos para quem busca praticidade! ✨ Encontrei **9 studios** modernos, a maioria com cozinha americana e área de serviço. Posso filtrar por faixa de preço?";
    }
    
    return "Entendi sua busca! 🔍 Estou analisando as melhores opções para você. Encontrei **15 apartamentos** que podem atender seus critérios. Quer que eu refine a busca por preço, localização ou características específicas?";
  };

  const getFollowUpSuggestions = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("pinheiros")) {
      return ["Ver fotos dos apartamentos", "Filtrar mobiliados", "Mostrar no mapa", "Agendar visita"];
    }
    if (lowerQuery.includes("pet")) {
      return ["Ver apartamentos com varanda", "Filtrar por tamanho", "Próximo a parques", "Ver todos"];
    }
    return ["Ordenar por preço", "Ver mais opções", "Adicionar mais filtros", "Criar alerta"];
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
            <p className="text-xs text-muted-foreground">Descreva o apartamento ideal para você</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3"
                  : "bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary">Hoomly AI</span>
                </div>
              )}
              <p
                className={`text-sm leading-relaxed ${
                  message.role === "user" ? "text-primary-foreground" : "text-foreground"
                }`}
                dangerouslySetInnerHTML={{
                  __html: message.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
              
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
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
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
          <span className="text-xs text-muted-foreground shrink-0">Populares:</span>
          {["Pinheiros", "Vila Madalena", "Jardins", "Itaim Bibi", "Moema"].map((location) => (
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
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Quero um 2 quartos em Pinheiros até R$ 3.500..."
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
