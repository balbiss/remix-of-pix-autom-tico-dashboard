import { useState, useEffect } from "react";
import { Zap, CheckCircle, Shield, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CheckoutModal from "@/components/CheckoutModal";
import { useSearchParams } from "react-router-dom";

const Landing = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number } | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("referral_code", ref);
      console.log("Referral captured:", ref);
    }
  }, [searchParams]);

  const openCheckout = (id: string, name: string, price: number) => {
    setSelectedPlan({ id, name, price });
    setCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden pb-20">
      {/* Hero */}
      <section className="relative px-5 pt-14 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center max-w-lg mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 bg-primary/12 text-primary rounded-full px-3.5 py-1.5 text-xs font-bold mb-7 border border-primary/20">
            <Zap className="h-3 w-3" />
            Novo método 2025
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-[1.15] mb-5">
            Transforme seu celular em uma máquina de{" "}
            <span className="text-gradient">Pix Automático</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-9 max-w-md mx-auto leading-relaxed">
            Adquira nosso E-book exclusivo e comece a gerar renda revendendo o produto digital. Sistema de comissões em 2 níveis.
          </p>

          <div className="flex flex-col gap-4">
            <Button
              onClick={() => openCheckout('standard', 'Plano Standard', 19.90)}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 h-14 px-8 text-base font-bold rounded-2xl shadow-glow"
            >
              Começar com Standard — R$ 19,90
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              onClick={() => openCheckout('premium', 'Plano Premium', 29.90)}
              variant="outline"
              size="lg"
              className="border-primary/20 bg-primary/5 text-primary h-14 px-8 text-base font-bold rounded-2xl"
            >
              Melhor Escolha: Premium — R$ 29,90
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">+2.400 usuários</span>
          </div>
        </motion.div>
      </section>

      {/* Plans Section */}
      <section className="px-5 py-12 bg-muted/30">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Escolha seu plano</h2>
          <div className="grid gap-6">
            {/* Standard */}
            <div className="card-elevated p-6 border-2 border-transparent">
              <h3 className="text-xl font-bold mb-2">Standard</h3>
              <p className="text-muted-foreground text-sm mb-4">Acesso ao E-book completo para iniciantes.</p>
              <div className="text-2xl font-bold mb-6">R$ 19,90</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary" /> E-book Pix Automático</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary" /> Painel de Afiliado</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary" /> Comissões em 2 níveis</li>
              </ul>
              <Button onClick={() => openCheckout('standard', 'Plano Standard', 19.90)} className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-0">Selecionar Standard</Button>
            </div>

            {/* Premium */}
            <div className="card-elevated p-6 border-2 border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">MAIS VENDIDO</div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <p className="text-muted-foreground text-sm mb-4">E-book + Masterclass exclusiva de vendas.</p>
              <div className="text-2xl font-bold mb-6">R$ 29,90</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary" /> Tudo do Standard</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary" /> Masterclass em Vídeo</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary" /> Suporte Prioritário</li>
              </ul>
              <Button onClick={() => openCheckout('premium', 'Plano Premium', 29.90)} className="w-full bg-primary text-primary-foreground shadow-glow">Selecionar Premium</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits info */}
      <section className="px-5 py-12">
        <div className="max-w-lg mx-auto space-y-3">
          <h2 className="text-xl font-bold text-center mb-6">Por que começar agora?</h2>
          {[
            { icon: Zap, text: "Ganhos em 2 níveis: R$ 10 direto e R$ 4 indireto (Plano Premium)" },
            { icon: Zap, text: "Ganhos em 2 níveis: R$ 6 direto e R$ 3 indireto (Plano Standard)" },
            { icon: Shield, text: "Pagamentos automáticos via Pix" },
          ].map((item, i) => (
            <div key={i} className="card-elevated flex items-center gap-3.5 p-4">
              <div className="h-8 w-8 rounded-lg bg-primary/12 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-5 py-12 mb-20">
        <div className="max-w-lg mx-auto">
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Exoneração de Responsabilidade
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Os ganhos apresentados são provenientes da revenda do produto digital. Não garantimos retorno financeiro fixo. Seus resultados dependem do seu desempenho.
            </p>
          </div>
        </div>
      </section>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        planId={selectedPlan?.id}
        planName={selectedPlan?.name}
        planPrice={selectedPlan?.price}
      />
    </div>
  );
};

export default Landing;
