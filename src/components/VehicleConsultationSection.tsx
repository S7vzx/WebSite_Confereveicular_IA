import { useState, useEffect, memo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LazyImage from "@/components/LazyImage";

// Import consultation images
const consultaPlacaImg = "/uploads/f2f21bf1-9184-44d5-a248-4cb3d3245ef2.png";
import consultaChassiImg from "@/assets/consulta-chassi.webp";
import consultaRenavamImg from "@/assets/consulta-renavam-moderna.webp";
import consultaCrvImg from "@/assets/consulta-crv-moderna.webp";
import consultaProprietarioImg from "@/assets/consulta-proprietario.webp";
import historicoProprietarioImg from "@/assets/historico-proprietario.webp";
import consultaLeilaoImg from "@/assets/consulta-leilao.webp";
import rouboFurtoImg from "@/assets/roubo-furto.webp";
import consultaSinistroImg from "@/assets/consulta-sinistro.webp";
import comunicacaoVendaImg from "@/assets/comunicacao-venda.webp";
import emitirCrlvImg from "@/assets/consulta-crlv-moderna.webp";
import consultaDebitosImg from "@/assets/consulta-debitos.webp";
import consultaMultasImg from "@/assets/consulta-multas.webp";
import consultaGravameImg from "@/assets/consulta-gravame-moderna.webp";
import consultaRenainfImg from "@/assets/consulta-renainf-moderna.webp";
import consultaRenajudImg from "@/assets/consulta-renajud-moderna.webp";

const VehicleConsultationSection = memo(() => {
  const { toast } = useToast();

  const getConsultationInfo = (cardId: string) => {
    const consultationInfo: Record<string, any> = {
      "placa": {
        title: "Consulta de Placa",
        info: [
          "Informações Retornadas:",
          "Placa",
          "Renavam",
          "Chassi",
          "Roubo ou Furto",
          "Número do Motor",
          "Nome do proprietário",
          "Restrições",
          "Outras informações adicionais"
        ]
      },
      "chassi": {
        title: "Consulta de Chassi",
        info: [
          "Informações Retornadas:",
          "Placa",
          "Renavam",
          "Ano de fabricação",
          "Outras informações adicionais",
          "Número do Motor",
          "Roubo ou Furto",
          "Restrições"
        ]
      },
      "renavam": {
        title: "Consulta de Renavam",
        info: [
          "Informações Retornadas:",
          "Renavam",
          "Placa",
          "Chassi",
          "Dados do proprietário",
          "Roubo ou Furto",
          "Nº do Motor",
          "Outras informações adicionais"
        ]
      },
      "emitir-crv": {
        title: "Consulta Veicular",
        info: [
          "Informações Retornadas:",
          "Número de segurança do CRV",
          "Placa",
          "Renavam",
          "Ano de fabricação",
          "Ano de modelo",
          "Marca/modelo/versão",
          "Outras informações relevantes",
        ]
      },
      "emitir-crlv": {
        title: "Consulta Veicular",
        info: [
          "Informações Retornadas:",
          "Número de segurança do CRLV",
          "Placa",
          "Renavam",
          "Ano de fabricação",
          "Ano de modelo",
          "Marca/modelo/versão",
          "Outras informações relevantes",
        ]
      },
      "proprietario-atual": {
        title: "Consulta Proprietário Atual",
        info: [
          "Informações Retornadas:",
          "Nome completo do proprietário",
          "CPF/CNPJ",
          "Endereço atualizado",
          "Nome da mãe",
          "Probabilidade de óbito",
          "Telefones",
          "Data de nascimento",
          "Outras informações do proprietário"
        ]
      },
      "historico-proprietario": {
        title: "Histórico de Proprietário",
        info: [
          "Informações Retornadas:",
          "Nome do proprietário atual",
          "Nome dos últimos proprietários",
          "Placa",
          "Renavam",
          "Chassi",
          "Marca/Modelo",
          "Cor",
          "Município",
          "Outras informações adicionais"
        ]
      },
      "leilao": {
        title: "Consulta de Leilão",
        info: [
          "Informações Retornadas:",
          "Score",
          "Lote",
          "Comitente",
          "Aceitação de seguro",
          "Percentual sobre a tabela de referência",
          "Necessidade de vistoria especial",
          "Data do leilão",
          "Outras informações adicionais"
        ]
      },
      "roubo-furto": {
        title: "Consulta de Roubo/Furto",
        info: [
          "Informações Retornadas:",
          "Indicativo de Roubo/Furto",
          "Situação de Roubo/Furto",
          "Outras informações adicionais",
        ]
      },
      "sinistro": {
        title: "Consulta de Sinistro",
        info: [
          "Informações Retornadas:",
          "Indício de sinistro completo",
        ]
      },
      "comunicacao-venda": {
        title: "Consulta Comunicação de Venda",
        info: [
          "Informações Retornadas:",
          "Data de Venda",
          "Inclusão",
          "Status",
          "Tipo de Comprador",
          "Documento do Comprador",
          "Placa",
          "Procedência",
          "Outras informações adicionais"
        ]
      },
      "gravame": {
        title: "Consulta de Gravame",
        info: [
          "Informações Retornadas:",
          "Nome do proprietário atual",
          "Placa",
          "Renavam",
          "Chassi",
          "Situação",
          "Data do gravame",
          "Financeira",
          "Observações do gravame"
        ]
      },
      "debitos": {
        title: "Consulta de Débitos",
        info: [
          "Informações Retornadas:",
          "Licenciamento",
          "Valor do licenciamento",
          "IPVA",
          "Valor de IPVA",
          "Multas",
          "Valor das Multas",
          "DPVAT",
          "Valor de DPVAT",
          "Opções de parcelamento"
        ]
      },
      "multas": {
        title: "Consulta de Multas",
        info: [
          "Informações Retornadas:",
          "Licenciamento",
          "Valor do licenciamento",
          "IPVA",
          "Valor de IPVA",
          "Multas",
          "Valor das Multas",
          "DPVAT",
          "Valor de DPVAT",
          "Opções de parcelamento"
        ]
      },
      "renainf": {
        title: "Consulta de Renainf",
        info: [
          "Informações Retornadas:",
          "Total de multas renainf ativas",
          "Auto da infração",
          "Local da infração",
          "Valor do pagamento",
          "Data do pagamento",
          "Placa",
          "Órgão atuadoro",
          "Marca/Modelo",
          "Outras informações adicionais"
        ]
      },
      "renajud": {
        title: "Consulta de Renajud",
        info: [
          "Informações Retornadas:",
          "Consta renajud",
          "Data da inclusão",
          "Placa",
          "Chassi",
          "Ocorrência",
          "Tipo de restrição judicial",
          "Órgão Judicial",
          "Quantidade de ocorrências",
          "Outras informações adicionais"
        ]
      }
    };
    return consultationInfo[cardId] || {
      title: "Consulta não encontrada",
      info: [
        "Tipo de consulta não identificado.",
        "Entre em contato para mais informações."
      ]
    };
  };
  // Specific consultation images mapping with new generated images
  const consultationImages: Record<string, string> = {
    // Registro e Identificação
    "placa": consultaPlacaImg,
    "chassi": "/uploads/53153fec-2861-47f0-b7e3-bd0a662e7f4a.png",
    "renavam": `/uploads/5a4cc136-aa41-4b46-9bb8-05b4c93f0fa0.png?t=${Date.now()}`,
    "crv": "/uploads/29750269-c40b-45ed-b098-02431cf4f20f.png",
    "proprietario-atual": consultaProprietarioImg,
    "historico-proprietario": "/uploads/cfe6442e-6c06-4719-8ef7-b9e95b093416.png",

    // Histórico do Veículo  
    "leilao": consultaLeilaoImg,
    "roubo-furto": rouboFurtoImg,
    "sinistro": consultaSinistroImg,
    "comunicacao-venda": comunicacaoVendaImg,

    // Documentação e Emissões
    "emitir-crv": "/uploads/a09458a2-7806-474e-84ea-178ca895ae42.png",
    "emitir-crlv": `/uploads/999b4a9e-e214-4b28-84c9-973c58f23a65.png?t=${Date.now()}`,

    // Multas e Débitos
    "gravame": "/uploads/5c13d18f-5a0a-4a7f-960e-0ad0a5fd4299.png",
    "debitos": consultaDebitosImg,
    "multas": consultaMultasImg,
    "renainf": `/uploads/e34ef6b9-9248-415e-b065-5a386fd6a1ca.png?t=${Date.now()}`,
    "renajud": "/uploads/4402c755-a481-4f35-8e91-7c18d8c53434.png",
  };

  const consultationCards = {
    "registro": [
      {
        id: "placa",
        title: "Consulta de Placa",
        image: consultationImages["placa"],
      },
      {
        id: "chassi",
        title: "Consulta de Chassi",
        image: consultationImages["chassi"],
      },
      {
        id: "renavam",
        title: "Consulta de Renavam",
        image: consultationImages["renavam"],
      },
      {
        id: "proprietario-atual",
        title: "Consulta Proprietário Atual",
        image: consultationImages["proprietario-atual"],
      },
      {
        id: "historico-proprietario",
        title: "Histórico de Proprietário",
        image: consultationImages["historico-proprietario"],
      }
    ],
    "situacao": [
      {
        id: "leilao",
        title: "Consulta de Leilão",
        image: consultationImages["leilao"],
      },
      {
        id: "roubo-furto",
        title: "Consulta de Roubo/Furto",
        image: consultationImages["roubo-furto"],
      },
      {
        id: "sinistro",
        title: "Consulta de Sinistro",
        image: consultationImages["sinistro"],
      },
      {
        id: "comunicacao-venda",
        title: "Consulta Comunicação de Venda",
        image: consultationImages["comunicacao-venda"],
      }
    ],
    "eventos": [
      {
        id: "emitir-crv",
        title: "Emitir CRV",
        image: consultationImages["emitir-crv"],
      },
      {
        id: "emitir-crlv",
        title: "Emitir CRLV",
        image: consultationImages["emitir-crlv"],
      }
    ],
    "sos": [
      {
        id: "gravame",
        title: "Consulta de Gravame",
        image: consultationImages["gravame"],
      },
      {
        id: "debitos",
        title: "Consulta de Débitos",
        image: consultationImages["debitos"],
      },
      {
        id: "multas",
        title: "Consulta de Multas",
        image: consultationImages["multas"],
      },
      {
        id: "renainf",
        title: "Consulta de Renainf",
        image: consultationImages["renainf"],
      },
      {
        id: "renajud",
        title: "Consulta de Renajud",
        image: consultationImages["renajud"],
      }
    ]
  };

  const ConsultationCard = memo(({ card, index }: { card: any; index: number }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [cardImageLoaded, setCardImageLoaded] = useState(false);
    const consultationInfo = getConsultationInfo(card.id);



    return (
      <div
        className="group opacity-0 animate-fade-in relative h-56 md:h-64 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer border border-accent/10"
        style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
      >
        {/* Loading placeholder for card background */}
        {!cardImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-muted/60 animate-pulse" />
        )}

        {/* Card background image */}
        <LazyImage
          src={card.image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110`}
          onLoad={() => setCardImageLoaded(true)}
          eager={index < 3}
        />

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

        {/* Content container */}
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8 text-white">
          <div className="flex-1 flex items-start">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight text-shadow-sm text-white transition-colors duration-300">
              {card.title}
            </h3>
          </div>

          <div className="flex items-center justify-start">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-xl w-auto transition-all duration-300 text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className="relative z-10">Quero uma consulta</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[480px] max-h-[90vh] flex flex-col bg-gradient-to-br from-card to-card/95 border border-accent/20 shadow-2xl rounded-2xl p-4">
                <DialogHeader className="text-center pb-2 shrink-0">
                  <DialogTitle className="text-lg sm:text-xl font-bold text-primary mb-1 flex items-center justify-center gap-2">
                    <img
                      src="/uploads/c044ffa8-9ef0-478d-8ad6-c3f980adca44.png"
                      alt="ConfereVeicular Logo"
                      className="w-6 h-6"
                    />
                    {consultationInfo.title}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-xs text-center">
                    Informações completas e atualizadas sobre o veículo
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-1">
                  {/* Specific content for CRV consultation - Documentação section */}
                  {card.id === 'crv' && (
                    <div className="bg-accent/5 rounded-lg p-3 border border-accent/10">
                      <h4 className="font-semibold text-primary text-sm mb-2">Documentação</h4>
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src="/uploads/a62780f5-0882-41d8-9fab-983f3dc2509b.png"
                          alt="Exemplo de CRV - Certificado de Registro de Veículo"
                          className="w-full max-w-xs h-28 object-cover rounded-lg border"
                        />
                        <p className="text-xs text-muted-foreground text-center">
                          CRV - Certificado de Registro de Veículo (documento azul)
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-accent/5 rounded-lg p-3 border border-accent/10">
                    <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        {!imageLoaded && (
                          <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                        )}
                        <img
                          src="/uploads/ee7054b1-46e7-411c-934e-cdb2ae069ef2.png"
                          alt="Info Icon"
                          className={`w-4 h-4 transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                          onLoad={() => setImageLoaded(true)}
                          style={{ display: imageLoaded ? 'block' : 'none' }}
                        />
                      </div>
                      {consultationInfo.info[0]}
                    </h4>
                    <div className="grid gap-1.5">
                      {consultationInfo.info.slice(1).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent/10 transition-colors duration-200">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-accent to-primary rounded-full shrink-0"></div>
                          <span className="text-foreground text-xs font-medium leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-3 shrink-0">
                  <Button
                    variant="outline"
                    className="w-full sm:flex-1 border-2 border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-300 h-10 rounded-lg text-sm"
                    onClick={() => setDialogOpen(false)}
                  >
                    Fechar
                  </Button>
                  <Button
                    asChild
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-white font-bold py-2 px-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-10 text-sm"
                  >
                    <a
                      href={`https://wa.me/5511921021578?text=${encodeURIComponent(
                        (() => {
                          const messages: Record<string, string> = {
                            "placa": "Olá, gostaria de consultar uma placa!",
                            "chassi": "Olá, gostaria de consultar um chassi!",
                            "renavam": "Olá, gostaria de consultar um renavam!",
                            "crv": "Olá, gostaria de consultar um CRV!",
                            "proprietario-atual": "Olá, gostaria de consultar o proprietário atual!",
                            "historico-proprietario": "Olá, gostaria de consultar o histórico de proprietário!",
                            "leilao": "Olá, gostaria de consultar leilão!",
                            "roubo-furto": "Olá, gostaria de consultar roubo/furto!",
                            "sinistro": "Olá, gostaria de consultar sinistro!",
                            "comunicacao-venda": "Olá, gostaria de consultar comunicação de venda!",
                            "emitir-crv": "Olá, gostaria de emitir CRV!",
                            "emitir-crlv": "Olá, gostaria de emitir CRLV!",
                            "gravame": "Olá, gostaria de consultar gravame!",
                            "debitos": "Olá, gostaria de consultar débitos!",
                            "multas": "Olá, gostaria de consultar multas!",
                            "renainf": "Olá, gostaria de consultar renainf!",
                            "renajud": "Olá, gostaria de consultar renajud!"
                          };
                          return messages[card.id] || "Olá, gostaria de fazer uma consulta veicular!";
                        })()
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 8v6M23 11l-3 3-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Falar com especialista
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    );
  });

  return (
    <section id="consultas" className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-primary/3 to-accent/5">
      {/* Background decorativo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-accent/3 rounded-full blur-2xl"></div>
        <div className="absolute top-1/4 right-10 w-24 h-24 bg-primary/3 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 relative">
              Escolha o Tipo de
              <span className="text-primary ml-3">
                Consulta
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-primary rounded-full"></div>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              Selecione a categoria de consulta que você precisa e tenha acesso a informações detalhadas sobre qualquer veículo
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <Tabs defaultValue="registro" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-gradient-to-r from-background/80 via-background/90 to-background/80 backdrop-blur-sm border border-accent/20 shadow-xl rounded-2xl p-2 h-auto max-w-5xl">
                <TabsTrigger
                  value="registro"
                  className="text-sm font-semibold px-6 py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="font-bold">Registro e Identificação</div>
                    <div className="text-xs opacity-80 mt-1">Dados básicos do veículo</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="situacao"
                  className="text-sm font-semibold px-6 py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="font-bold">Histórico do Veículo</div>
                    <div className="text-xs opacity-80 mt-1">Situação e histórico</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="eventos"
                  className="text-sm font-semibold px-6 py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="font-bold">Documentação</div>
                    <div className="text-xs opacity-80 mt-1">Emissões e documentos</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="sos"
                  className="text-sm font-semibold px-6 py-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="font-bold">Multas e Débitos</div>
                    <div className="text-xs opacity-80 mt-1">Pendências financeiras</div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="registro" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {consultationCards.registro.map((card, index) => (
                  <ConsultationCard key={card.id} card={card} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="situacao" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {consultationCards.situacao.map((card, index) => (
                  <ConsultationCard key={card.id} card={card} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="eventos" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {consultationCards.eventos.map((card, index) => (
                  <ConsultationCard key={card.id} card={card} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sos" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {consultationCards.sos.map((card, index) => (
                  <ConsultationCard key={card.id} card={card} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollReveal>
      </div>
    </section>
  );
});

VehicleConsultationSection.displayName = 'VehicleConsultationSection';

export default VehicleConsultationSection;
