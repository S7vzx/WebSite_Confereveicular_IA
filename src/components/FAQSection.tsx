import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const FAQSection = () => {
  const faqItems = [
    {
      question: "Quais tipos de veículos podem ser consultados?",
      answer: "Você pode consultar informações de carros, motos, caminhões e outros veículos emplacados no Brasil através da nossa plataforma."
    },
    {
      question: "Há algum custo para realizar uma consulta?",
      answer: "Sim, oferecemos consultas pagas com informações detalhadas e confiáveis. Os preços variam conforme o tipo de consulta escolhida."
    },
    {
      question: "As informações fornecidas são confiáveis?",
      answer: "Absolutamente! Utilizamos dados oficiais e fontes públicas confiáveis, garantindo a veracidade e atualização das informações."
    },
    {
      question: "Quais métodos de pagamento são aceitos?",
      answer: "Aceitamos cartões de crédito, débito, PIX e boleto bancário para maior conveniência dos nossos clientes."
    },
    {
      question: "O que recebo ao efetuar uma compra?",
      answer: "Você receberá um relatório completo com todas as informações disponíveis do veículo consultado, incluindo dados técnicos, situação legal e histórico."
    },
    {
      question: "Posso solicitar reembolso do valor pago?",
      answer: "Sim, oferecemos garantia de reembolso conforme nossos termos de uso. Entre em contato conosco para mais informações."
    }
  ];

  return (
    <section id="faq" className="py-12 md:py-16 bg-info-section-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary text-center mb-8 md:mb-12">
              FAQ - Perguntas Frequentes
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border-l-4 border-l-accent border-r border-border rounded-lg shadow-sm px-4 sm:px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline py-4 sm:py-6 text-sm sm:text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 sm:pb-6 pt-0 text-sm sm:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;