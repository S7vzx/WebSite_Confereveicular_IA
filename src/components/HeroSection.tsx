
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Users, Building } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { preloadCriticalImages } from "@/utils/performance";

const HeroSection = memo(() => {
  const [inputValue, setInputValue] = useState("");
  const [inputFontSize, setInputFontSize] = useState("text-lg sm:text-xl md:text-2xl");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Preload critical images on component mount
  useEffect(() => {
    preloadCriticalImages();
  }, []);

  useEffect(() => {
    const updateInputSize = () => {
      const width = window.innerWidth;
      if (width <= 320) {
        setInputFontSize("text-[10px]");
      } else if (width <= 375) {
        setInputFontSize("text-xs");
      } else if (width <= 480) {
        setInputFontSize("text-xs");
      } else if (width <= 768) {
        setInputFontSize("text-base");
      } else if (width <= 1024) {
        setInputFontSize("text-lg");
      } else {
        setInputFontSize("text-xl");
      }
    };

    updateInputSize();
    window.addEventListener('resize', updateInputSize);
    return () => window.removeEventListener('resize', updateInputSize);
  }, []);

  const stats = [
    {
      icon: Shield,
      number: "50 mil",
      text: "consultas veiculares já realizadas"
    },
    {
      icon: Users,
      number: "10 mil clientes",
      text: "confiam no ConfereVeicular"
    },
    {
      icon: Building,
      number: "50 empresas",
      text: "já confiam em nosso portal"
    }
  ];

  return (
    <section
      className="py-12 md:py-16 lg:py-20 bg-hero-bg relative overflow-hidden"
    >
      {/* Background do carro - responsivo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(/uploads/fd5932e4-78b9-4795-af60-28883b4d0463.png)`,
          backgroundSize: isMobile ? '80%' : window.innerWidth <= 1024 ? '70%' : '60%',
          backgroundPosition: isMobile
            ? 'top 30% center'
            : window.innerWidth <= 1024
              ? 'top 25% right'
              : 'top 20% right',
          backgroundRepeat: 'no-repeat',
          opacity: isMobile ? 0.6 : window.innerWidth <= 1024 ? 0.8 : 1
        }}
      />

      {/* Gradiente degradê para mobile - lateral */}
      <div className="absolute inset-0 bg-gradient-to-r from-hero-bg via-hero-bg/80 to-transparent pointer-events-none z-[1] md:hidden"></div>

      {/* Gradiente degradê para tablet - lateral e inferior */}
      <div className="absolute inset-0 bg-gradient-to-r from-hero-bg via-hero-bg/70 to-transparent pointer-events-none z-[1] hidden md:block lg:hidden"></div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-hero-bg via-hero-bg/80 to-transparent pointer-events-none z-[1] hidden md:block lg:hidden"></div>

      {/* Gradiente degradê para desktop - inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-hero-bg via-hero-bg/60 to-transparent pointer-events-none z-[1] hidden lg:block"></div>

      {/* Gradiente adicional para blending suave */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-hero-bg/40 to-transparent pointer-events-none z-[1]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Content */}
          <ScrollReveal className="space-y-6 md:space-y-8 text-center lg:text-left relative z-20">
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight drop-shadow-sm">
                  Todas as informações<br />
                  do seu veículo
                </h1>
                <div className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-accent leading-none drop-shadow-sm">
                  EM 1 MINUTO
                </div>
                <p className="text-lg sm:text-xl md:text-xl lg:text-2xl font-medium text-foreground/80 mt-2 md:mt-3 drop-shadow-sm">
                  simples, rápido e seguro
                </p>
              </div>
            </div>

            {/* Search form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 w-full max-w-2xl mx-auto lg:mx-0 border border-white/20">
              <div id="consulta-principal" className="flex flex-col md:flex-row gap-3 sm:gap-4">
                <Input
                  placeholder="Digite Placa, Renavam ou Chassi"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`text-center lg:text-left ${inputFontSize} font-bold tracking-wider uppercase border-2 border-gray-300 bg-transparent focus-visible:ring-0 focus-visible:border-primary h-14 sm:h-16 px-4 sm:px-6 w-full md:flex-1`}
                />
                <Button
                  data-track="consulta-principal"
                  variant="cta"
                  className="h-14 sm:h-16 px-6 sm:px-8 text-base sm:text-lg font-bold w-full md:w-auto whitespace-nowrap"
                  asChild
                >
                  <a
                    href={`https://wa.me/5511921021578?text=${encodeURIComponent(`Olá! Gostaria de fazer uma consulta veicular para: ${inputValue.trim() || "..."}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!inputValue.trim()) {
                        e.preventDefault();
                        toast({
                          title: "🚗 Ops! Dados necessários",
                          description: "Informe a placa, RENAVAM ou chassi do seu veículo para prosseguir com a consulta.",
                          duration: 4000,
                        });
                      } else {
                        console.log('Botão consultar clicado');
                        console.log('Valor do input:', inputValue);
                      }
                    }}
                  >
                    <Search className="h-6 w-6" />
                    CONSULTAR
                  </a>
                </Button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground text-center lg:text-left">
              Este site utiliza dados e informações de fontes públicas.
            </p>

            {/* Video button */}
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium group transition-all duration-300 ease-out hover:no-underline"
              onClick={() => {
                document.getElementById('video-explainer')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-primary rounded-full flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25">
                  <div className="absolute inset-0 bg-primary rounded-full opacity-20 scale-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500 ease-out"></div>
                  <svg className="w-5 h-5 text-primary-foreground ml-0.5 z-10 relative transition-transform duration-300 ease-out group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold transition-all duration-300 ease-out group-hover:text-primary/90 group-hover:translate-x-1">Saiba mais sobre o Confere Veicular.</div>
                  <div className="text-sm text-muted-foreground transition-all duration-300 ease-out group-hover:text-accent group-hover:translate-x-1">Assista ao vídeo agora!</div>
                </div>
              </div>
            </Button>
          </ScrollReveal>

          {/* Right side - Hero Image */}
          <ScrollReveal delay={200}>
            <div className="flex justify-center items-center h-full mt-8 lg:mt-0">
              <div className="relative group cursor-pointer">
                <img
                  src="/uploads/f5472cd0-a719-4870-a846-6a0f274a9336.png"
                  alt="Especialista em consultas veiculares - ConfereVeicular"
                  className="w-full max-w-sm sm:max-w-md lg:max-w-2xl h-auto object-contain transition-all duration-700 ease-out transform group-hover:scale-105 group-hover:-translate-y-2 filter group-hover:brightness-110 group-hover:drop-shadow-2xl"
                />
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out blur-xl -z-10"></div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 pt-8 md:pt-16 relative z-20">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-white/95 backdrop-blur-sm border-2 border-success rounded-xl shadow-lg p-6 flex flex-col items-center text-center gap-4 hover:shadow-xl transition-all duration-300 min-h-[140px] hover:bg-white">
                <div className="w-12 h-12 border-2 border-success rounded-full flex items-center justify-center flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-primary text-base leading-tight mb-2">
                    Mais de <span className="text-success">{stat.number}</span>
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed">
                    {stat.text}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div >
    </section >
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
