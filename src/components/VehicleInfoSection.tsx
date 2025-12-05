import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const VehicleInfoSection = () => {
  const infoCards = [
    {
      title: "Informações do Veículo",
      description: "Acesse dados como cor, modelo, categoria e muito mais!"
    },
    {
      title: "Descubra o Chassi",
      description: "Consulte o número do chassi do veículo com rapidez e segurança!"
    },
    {
      title: "Descubra o Renavam",
      description: "Consulte o número do renavam de forma rápida e segura, essencial para negociações confiáveis."
    },
    {
      title: "Situação de roubo ou furto",
      description: "Verifique se o veículo possui registro de roubo ou furto e tenha mais segurança em sua consulta."
    },
    {
      title: "Nome do proprietário",
      description: "Descubra a quem o veículo está registrado, seja uma pessoa física ou uma empresa."
    },
    {
      title: "Histórico do veículo",
      description: "Descubra o histórico completo do veículo e tenha mais segurança em sua decisão."
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-info-section-bg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Content */}
          <ScrollReveal className="space-y-4 md:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-tight">
              Seu portal completo para consultas veiculares rápidas e detalhadas.
            </h2>
            
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Somos o maior site de consultas veiculares do Brasil, com anos de experiência e referência no mercado. 
              Descubra mais de 20 informações essenciais sobre veículos, como chassi, Renavam, cor, modelo, roubo e furto, 
              tudo com rapidez e confiança. Garanta segurança e tranquilidade ao comprar ou vender veículos 
              com nossa plataforma, reconhecida pela eficiência e confiabilidade.
            </p>

            <Button 
              variant="cta" 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
              onClick={() => {
                document.getElementById('consulta-principal')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'center'
                });
              }}
            >
              <Search className="h-5 w-5" />
              CONSULTAR AGORA
            </Button>
          </ScrollReveal>

          {/* Right side - Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8 lg:mt-0">
            {infoCards.map((card, index) => (
              <ScrollReveal key={index} delay={300 + index * 100}>
                <Card className="p-4 sm:p-6 hover:shadow-md transition-all duration-200 border-l-4 border-l-accent shadow-sm bg-card">
                  <h3 className="font-semibold text-primary mb-2 sm:mb-3 text-sm sm:text-base leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {card.description}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleInfoSection;
