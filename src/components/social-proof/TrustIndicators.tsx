import { ScrollReveal } from "@/hooks/useScrollReveal";

const trustData = [
  {
    value: "10.000+",
    label: "Consultas Realizadas",
    color: "primary"
  },
  {
    value: "4.9★",
    label: "Avaliação Média",
    color: "accent"
  },
  {
    value: "98%",
    label: "Clientes Satisfeitos",
    color: "secondary"
  },
  {
    value: "24h",
    label: "Suporte Online",
    color: "primary"
  }
];

const TrustIndicators = () => {
  return (
    <ScrollReveal delay={400}>
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {trustData.map((item, index) => (
          <div 
            key={index}
            className="text-center p-6 bg-card rounded-2xl border border-border hover:bg-muted transition-all duration-300"
          >
            <div className={`text-3xl font-bold text-${item.color} mb-2`}>
              {item.value}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
};

export default TrustIndicators;