
import { Button } from "@/components/ui/button";
import { Play, Search } from "lucide-react";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const VideoExplainerSection = () => {
  return (
    <section id="video-explainer" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Coluna Esquerda - Vídeo/Imagem */}
          <ScrollReveal className="relative">
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 md:p-8">
              <div className="relative aspect-video bg-primary rounded-xl overflow-hidden group cursor-pointer">
                {/* Overlay escuro no hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                
                {/* Botão Play sobreposto */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-14 h-14 sm:w-18 sm:h-18 group-hover:scale-110 transition-transform duration-300">
                    {/* Círculo animado de fundo - removido para evitar conflitos */}
                    <div className="absolute inset-0 w-full h-full bg-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Botão Play principal */}
                    <Button
                      className="relative w-full h-full rounded-full bg-accent hover:bg-accent/90 shadow-xl border-2 border-white/30 p-0 flex items-center justify-center transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Aqui você pode adicionar a lógica para abrir o vídeo
                        console.log('Play button clicked');
                      }}
                    >
                      <Play className="h-6 w-6 sm:h-7 sm:w-7 text-accent-foreground ml-0.5" fill="currentColor" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Coluna Direita - Conteúdo */}
          <ScrollReveal delay={200} className="space-y-4 md:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-tight">
              Veja como é simples, fácil e rápido consultar no ConfereVeicular!
            </h2>
            
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              O ConfereVeicular é uma plataforma especializada em consultas veiculares rápidas e detalhadas. 
              Oferecemos dados confiáveis, como modelo, cor, débitos e multas, com mais de 20 
              informações sobre veículos. Ideal para quem busca segurança e agilidade na compra, venda ou 
              análise de veículos.
            </p>

            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              onClick={() => {
                document.getElementById('consulta-principal')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'center'
                });
              }}
            >
              <Search className="h-5 w-5 mr-2" />
              COMECE SUA CONSULTA AGORA
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default VideoExplainerSection;
