import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, Users, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SobreNos = () => {
  const { toast } = useToast();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
          {/* Background decorativo */}
          <div className="absolute top-10 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 relative">
                  Sobre o
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-3">
                    ConfereVeicular
                  </span>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full"></div>
                </h1>
              </div>

              <div className="relative">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-4xl mx-auto">
                  Somos especialistas em consultas veiculares, oferecendo informações precisas e confiáveis
                  para garantir segurança e transparência nas suas transações automotivas.
                </p>

                {/* Elementos decorativos */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-accent/30"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossa História */}
        <section className="py-20 relative overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-primary/3"></div>
          <div className="absolute top-20 left-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 relative">
                  Nossa História
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-accent/20 rounded-full"></div>
                    <p className="text-muted-foreground text-lg leading-relaxed relative z-10">
                      O ConfereVeicular nasceu da necessidade de democratizar o acesso a informações
                      veiculares confiáveis no Brasil. Fundada por especialistas em tecnologia e
                      mercado automotivo, nossa plataforma revoluciona a forma como pessoas e empresas
                      consultam dados de veículos.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary/20 rounded-full"></div>
                    <p className="text-muted-foreground text-lg leading-relaxed relative z-10">
                      Com anos de experiência no setor, desenvolvemos uma solução que combina
                      tecnologia de ponta com dados oficiais dos órgãos competentes, garantindo
                      precisão e agilidade em cada consulta.
                    </p>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <Card className="bg-gradient-to-br from-background via-background/95 to-background border border-accent/20 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    {/* Elementos decorativos */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/15 to-transparent rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/15 to-transparent rounded-tr-full"></div>

                    <CardContent className="p-8 relative">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="text-center group">
                          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                            50K+
                          </div>
                          <div className="text-sm text-muted-foreground leading-tight">
                            Consultas Realizadas
                          </div>
                        </div>

                        <div className="text-center group">
                          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                            20+
                          </div>
                          <div className="text-sm text-muted-foreground leading-tight">
                            Tipos de Informações
                          </div>
                        </div>

                        <div className="text-center group">
                          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                            99.9%
                          </div>
                          <div className="text-sm text-muted-foreground leading-tight">
                            Precisão dos Dados
                          </div>
                        </div>

                        <div className="text-center group">
                          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                            24/7
                          </div>
                          <div className="text-sm text-muted-foreground leading-tight">
                            Disponibilidade
                          </div>
                        </div>
                      </div>

                      {/* Linha decorativa central */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-accent/30 to-transparent"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-accent/5 via-background to-primary/5">
          {/* Background decorativo */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-10 w-20 h-20 bg-accent/5 rounded-full blur-xl"></div>
            <div className="absolute top-1/3 right-10 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 relative">
                  Nossos Valores
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                <Card className="group bg-gradient-to-br from-background via-background/95 to-background border border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  {/* Elemento decorativo de fundo */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full group-hover:from-accent/20 transition-all duration-500"></div>

                  <CardContent className="p-8 text-center relative">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent/15 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Shield className="h-10 w-10 text-accent group-hover:scale-125 transition-all duration-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent/30 rounded-full group-hover:scale-150 transition-all duration-500"></div>
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                      Segurança
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Protegemos seus dados com a mais alta tecnologia de segurança e criptografia.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-background via-background/95 to-background border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full group-hover:from-primary/20 transition-all duration-500"></div>

                  <CardContent className="p-8 text-center relative">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Users className="h-10 w-10 text-primary group-hover:scale-125 transition-all duration-500" />
                      </div>
                      <div className="absolute -top-2 -left-2 w-3 h-3 bg-primary/30 rounded-full group-hover:scale-150 transition-all duration-500"></div>
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-primary/80 transition-colors duration-300">
                      Confiança
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Milhares de clientes confiam em nossa plataforma para consultas veiculares.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-background via-background/95 to-background border border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full group-hover:from-accent/20 transition-all duration-500"></div>

                  <CardContent className="p-8 text-center relative">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent/15 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Award className="h-10 w-10 text-accent group-hover:scale-125 transition-all duration-500" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-accent/20 rounded-full group-hover:scale-125 transition-all duration-500"></div>
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                      Qualidade
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Dados precisos e atualizados diretamente das fontes oficiais.
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-background via-background/95 to-background border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full group-hover:from-primary/20 transition-all duration-500"></div>

                  <CardContent className="p-8 text-center relative">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/15 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                        <Clock className="h-10 w-10 text-primary group-hover:scale-125 transition-all duration-500" />
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary/25 rounded-full group-hover:scale-150 transition-all duration-500"></div>
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-primary/80 transition-colors duration-300">
                      Agilidade
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Resultados instantâneos para que você tome decisões rápidas e assertivas.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Nossa Missão */}
        <section className="py-20 relative overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 relative">
                  Nossa Missão
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                </h2>
              </div>

              <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background border border-accent/20 shadow-2xl backdrop-blur-sm">
                {/* Elementos decorativos internos */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full"></div>

                <CardContent className="p-8 md:p-12 relative">
                  {/* Quote decorativo */}
                  <div className="text-6xl text-accent/20 font-serif absolute top-6 left-8">"</div>

                  <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 font-light italic relative z-10">
                      Democratizar o acesso a informações veiculares confiáveis, proporcionando
                      segurança e transparência para compradores, vendedores e profissionais do
                      mercado automotivo brasileiro.
                    </p>

                    {/* Quote decorativo de fechamento */}
                    <div className="text-6xl text-accent/20 font-serif absolute bottom-20 right-8 rotate-180">"</div>
                  </div>

                  {/* Separador decorativo */}
                  <div className="flex items-center justify-center my-8">
                    <div className="w-8 h-px bg-accent/30"></div>
                    <div className="w-2 h-2 bg-accent rounded-full mx-4"></div>
                    <div className="w-8 h-px bg-accent/30"></div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link to="/" className="group">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto group-hover:scale-105 transition-all duration-300 border-accent/30 hover:border-accent hover:shadow-lg"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        Voltar ao Início
                      </Button>
                    </Link>

                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      asChild
                    >
                      <a
                        href={`https://wa.me/5519996674425?text=${encodeURIComponent("Olá! Gostaria de fazer uma consulta veicular!")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="relative z-10">Fazer uma Consulta</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SobreNos;