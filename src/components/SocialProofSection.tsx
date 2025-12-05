
import { ScrollReveal } from "@/hooks/useScrollReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import VideoTestimonialCard from "@/components/social-proof/VideoTestimonialCard";
import TrustIndicators from "@/components/social-proof/TrustIndicators";

const socialProofVideos = [
  {
    id: 1,
    clientName: "André",
    title: "Veja o que o André achou...",
    thumbnail: "https://img.youtube.com/vi/WVqak0ai5PU/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=WVqak0ai5PU",
    embedUrl: "https://www.youtube.com/embed/WVqak0ai5PU",
    rating: 5,
    testimonial: "Excelente serviço! Consegui todas as informações que precisava do meu veículo de forma rápida e confiável."
  },
  {
    id: 2,
    clientName: "Patrícia", 
    title: "Veja o que a Patrícia achou...",
    thumbnail: "https://img.youtube.com/vi/bjJPBigo8fc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=bjJPBigo8fc",
    embedUrl: "https://www.youtube.com/embed/bjJPBigo8fc",
    rating: 5,
    testimonial: "Plataforma muito fácil de usar. As consultas são precisas e me ajudaram muito na compra do meu carro."
  },
  {
    id: 3,
    clientName: "Daniel",
    title: "Veja o que o Daniel achou...",
    thumbnail: "https://img.youtube.com/vi/r9FLvUy7LCE/maxresdefault.jpg", 
    videoUrl: "https://www.youtube.com/watch?v=r9FLvUy7LCE",
    embedUrl: "https://www.youtube.com/embed/r9FLvUy7LCE",
    rating: 5,
    testimonial: "Recomendo para todos! Salvou minha compra, descobri problemas que nem imaginava no veículo."
  }
];

const SocialProofSection = () => {
  return (
    <section className="py-20 bg-muted relative overflow-hidden">
      {/* Clean background pattern */}
      <div className="absolute inset-0">
        {/* Subtle decorative elements */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-2xl"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-medium">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                Depoimentos Reais
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Veja o que nossos clientes falam sobre o Confere Veicular
            </p>
            <div className="flex items-center justify-center gap-1 p-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 inline-flex shadow-large hover:shadow-extra-large animate-float hover:scale-[1.02] transition-all duration-1500 ease-out">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-accent fill-current animate-[pulse_6s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.8}s` }} />
              ))}
              <span className="text-foreground ml-3 font-semibold">4.9/5 - Mais de 10.000 consultas realizadas</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {socialProofVideos.map((video) => (
                  <CarouselItem key={video.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <VideoTestimonialCard video={video} />
                   </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Navigation buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <CarouselPrevious className="relative inset-auto translate-y-0 bg-card border-border text-primary hover:bg-primary hover:text-primary-foreground shadow-medium" />
                <CarouselNext className="relative inset-auto translate-y-0 bg-card border-border text-primary hover:bg-primary hover:text-primary-foreground shadow-medium" />
              </div>
            </Carousel>
          </div>
        </ScrollReveal>

        {/* Trust indicators */}
        <TrustIndicators />
      </div>
    </section>
  );
};

export default SocialProofSection;
