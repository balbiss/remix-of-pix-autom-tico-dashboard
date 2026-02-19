import { useState } from "react";
import { Zap, CheckCircle, Shield, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CheckoutModal from "@/components/CheckoutModal";

const Landing = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero */}
      <section className="relative px-5 pt-14 pb-16">
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
          <Button
            onClick={() => setCheckoutOpen(true)}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 h-14 px-8 text-base font-bold rounded-2xl shadow-glow"
          >
            Adquirir Acesso Agora — R$ 19,90
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mt-6">
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

      {/* Benefits */}
      <section className="px-5 pb-12">
        <div className="max-w-lg mx-auto space-y-3">
          {[
            { icon: CheckCircle, text: "Acesso imediato ao E-book completo" },
            { icon: CheckCircle, text: "Painel de afiliado para acompanhar ganhos" },
            { icon: CheckCircle, text: "Comissão de R$ 10 por indicação direta" },
            { icon: CheckCircle, text: "Comissão de R$ 5 por indicação de nível 2" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="card-elevated flex items-center gap-3.5 p-4"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/12 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-foreground text-sm font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-5 pb-28">
        <div className="max-w-lg mx-auto">
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Exoneração de Responsabilidade
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Os ganhos apresentados são provenientes da revenda do produto digital (E-book). Os resultados variam de acordo com o esforço, dedicação e estratégia de cada usuário. Não garantimos nenhum retorno financeiro específico. Ao adquirir o acesso, você concorda com os termos de uso da plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="fixed bottom-0 left-0 right-0 p-4 glass-nav z-40">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={() => setCheckoutOpen(true)}
            className="w-full h-13 bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 font-bold text-sm rounded-xl shadow-glow"
          >
            Adquirir Acesso — R$ 19,90
          </Button>
        </div>
      </section>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  );
};

export default Landing;
