import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Bell, Sparkles, Shield, Clock, MapPin, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import apartment3 from "@/assets/apartment-3.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Image src={logo} alt="Hoomly AI" className="h-8 w-auto" width={120} height={32} />
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Depoimentos
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button className="text-sm font-medium bg-primary hover:bg-primary/90">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Busca de apartamentos com IA
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Encontre seu apartamento{" "}
                <span className="text-primary">ideal</span> com inteligência artificial
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                O Hoomly AI automatiza sua busca, analisa milhares de opções e te notifica quando encontra o match perfeito. Economize tempo e encontre seu lar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 bg-primary hover:bg-primary/90">
                    Começar Busca Grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                  Ver Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">50k+</p>
                  <p className="text-sm text-muted-foreground">Apartamentos</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-foreground">10k+</p>
                  <p className="text-sm text-muted-foreground">Usuários</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-foreground">98%</p>
                  <p className="text-sm text-muted-foreground">Satisfação</p>
                </div>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Image
                    src={apartment1}
                    alt="Apartamento moderno"
                    className="rounded-2xl shadow-card-hover w-full h-48 object-cover"
                    width={400}
                    height={192}
                  />
                  <Image
                    src={apartment2}
                    alt="Quarto aconchegante"
                    className="rounded-2xl shadow-card-hover w-full h-64 object-cover"
                    width={400}
                    height={256}
                  />
                </div>
                <div className="pt-8 space-y-4">
                  <Image
                    src={apartment3}
                    alt="Cozinha moderna"
                    className="rounded-2xl shadow-card-hover w-full h-64 object-cover"
                    width={400}
                    height={256}
                  />
                  <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Novo match!</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Encontrei 3 apartamentos em Pinheiros que combinam com você
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que escolher o Hoomly AI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tecnologia de ponta para simplificar sua busca por apartamentos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: "Busca Inteligente",
                description: "IA que entende suas preferências e encontra os melhores matches",
              },
              {
                icon: Bell,
                title: "Alertas em Tempo Real",
                description: "Seja notificado assim que um apartamento ideal aparecer",
              },
              {
                icon: Shield,
                title: "Verificação Segura",
                description: "Todos os anúncios são verificados para sua segurança",
              },
              {
                icon: Clock,
                title: "Economize Tempo",
                description: "Reduza horas de busca para minutos com automação",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-card-hover transition-all"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para encontrar seu apartamento ideal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Defina suas preferências",
                description: "Conte para a IA o que você procura: localização, preço, número de quartos e mais",
              },
              {
                step: "02",
                title: "Deixe a IA trabalhar",
                description: "Nosso algoritmo analisa milhares de apartamentos e encontra os melhores matches",
              },
              {
                step: "03",
                title: "Receba notificações",
                description: "Seja alertado instantaneamente quando novos apartamentos surgirem",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-7xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que dizem nossos usuários
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Marina Silva",
                role: "Designer",
                avatar: "MS",
                content: "Encontrei meu apartamento em Pinheiros em menos de uma semana! A IA realmente entendeu o que eu procurava.",
              },
              {
                name: "Pedro Santos",
                role: "Desenvolvedor",
                avatar: "PS",
                content: "Os alertas em tempo real são incríveis. Fui um dos primeiros a visitar o apartamento e consegui fechar negócio.",
              },
              {
                name: "Julia Costa",
                role: "Arquiteta",
                avatar: "JC",
                content: "Economizei horas de busca. O Hoomly filtrou exatamente o que eu precisava e ainda deu dicas sobre os bairros.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-12 text-center border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pronto para encontrar seu lar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comece sua busca gratuita agora e deixe a IA fazer o trabalho pesado por você
            </p>
            <Link href="/login">
              <Button size="lg" className="text-base px-10 bg-primary hover:bg-primary/90">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Sem cartão de crédito
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Cancele quando quiser
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image src={logo} alt="Hoomly AI" className="h-7 w-auto" width={100} height={28} />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Contato</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Hoomly AI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
