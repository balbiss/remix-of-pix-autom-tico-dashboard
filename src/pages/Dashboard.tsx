import { useState } from "react";
import { Copy, Check, ArrowDownToLine, Users, Network, Wallet, TrendingUp, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const affiliateLink = "pixautomatico.com/join?ref=user_id";

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast({ title: "Link copiado!", description: "Seu link de afiliado foi copiado." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Status Bar Spacer */}
      <div className="h-2" />

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-5">
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Bem-vindo de volta 👋</p>
          <h1 className="text-xl font-display font-bold text-foreground mt-0.5">Pix Automático</h1>
        </div>
        <div className="relative">
          <div className="h-11 w-11 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-glow">
            U
          </div>
          <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-accent border-2 border-background" />
        </div>
      </header>

      <div className="px-5 space-y-4">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-gradient-primary rounded-3xl p-6 shadow-glow"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-3">
              <Wallet className="h-4 w-4 text-primary-foreground/70" />
              <span className="text-primary-foreground/70 text-xs font-semibold tracking-wide uppercase">
                Saldo Disponível
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-[2.5rem] leading-none font-display font-bold text-primary-foreground tracking-tight">
                  R$ 127<span className="text-2xl">,40</span>
                </h2>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="flex items-center gap-1 bg-primary-foreground/15 rounded-full px-2.5 py-1">
                    <TrendingUp className="h-3 w-3 text-primary-foreground" />
                    <span className="text-primary-foreground text-[11px] font-semibold">
                      R$ 342,80 total
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate("/saque")}
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 backdrop-blur-sm rounded-xl h-11 px-5 font-semibold shadow-lg"
              >
                <ArrowDownToLine className="h-4 w-4 mr-1.5" />
                Sacar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="card-elevated p-4"
          >
            <div className="stat-icon mb-3">
              <Users className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">12</p>
            <p className="text-muted-foreground text-[11px] font-medium mt-1">Indicações Diretas</p>
            <p className="text-muted-foreground/60 text-[10px]">Nível 1</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="card-elevated p-4"
          >
            <div className="stat-icon mb-3">
              <Network className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">47</p>
            <p className="text-muted-foreground text-[11px] font-medium mt-1">Indicações da Rede</p>
            <p className="text-muted-foreground/60 text-[10px]">Nível 2</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="card-elevated p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/12 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ganhe mais comissões</p>
                <p className="text-[11px] text-muted-foreground">Compartilhe seu link e lucre</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Affiliate Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="card-elevated p-5"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Seu Link de Afiliado
          </p>
          <div className="flex gap-2">
            <div className="flex-1 bg-muted rounded-xl px-3.5 py-3 text-sm text-muted-foreground truncate font-mono border border-border">
              {affiliateLink}
            </div>
            <Button
              onClick={handleCopy}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 shrink-0 rounded-xl h-auto px-4 shadow-glow"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
