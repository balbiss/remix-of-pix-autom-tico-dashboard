import { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Withdrawal = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const numericAmount = parseFloat(amount.replace(",", ".")) || 0;
  const isValid = numericAmount >= 50 && pixKey.trim().length > 0 && (profile?.saldo || 0) >= (numericAmount + 4.90);

  const handleWithdraw = async () => {
    if (!isValid) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('cashout-process', {
        body: {
          amount: numericAmount,
          pixKey: pixKey,
          pixKeyType: 'RANDOM' // Default or based on logic
        }
      });

      if (error) throw error;

      toast({
        title: "Saque solicitado!",
        description: `Saque de R$ ${numericAmount.toFixed(2)} processado com sucesso.`,
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Erro no saque",
        description: err.message || "Não foi possível processar seu saque.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-6 pb-5">
        <button
          onClick={() => navigate("/dashboard")}
          className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <h1 className="text-lg font-display font-bold text-foreground">Solicitar Saque</h1>
      </header>

      <div className="px-5 space-y-4">
        {/* Balance Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-5 text-center"
        >
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Saldo Disponível</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">
            R$ {profile?.saldo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "0,00"}
          </p>
        </motion.div>

        {/* Amount Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor do Saque</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">R$</span>
            <Input
              type="text"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-11 text-lg h-13 bg-muted border-border font-display rounded-xl"
            />
          </div>
        </motion.div>

        {/* Fee Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-start gap-3 card-elevated p-4"
        >
          <div className="h-8 w-8 rounded-lg bg-destructive/12 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Taxa de processamento: <span className="text-foreground font-semibold">R$ 4,90</span> por saque.</p>
            <p>Valor mínimo para saque: <span className="text-foreground font-semibold">R$ 50,00</span>.</p>
          </div>
        </motion.div>

        {/* Pix Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sua Chave Pix</label>
          <Input
            type="text"
            placeholder="CPF, e-mail, telefone ou chave aleatória"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            className="h-13 bg-muted border-border rounded-xl"
          />
        </motion.div>

        {/* Net Amount Preview */}
        {numericAmount >= 50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-elevated p-5"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor do saque</span>
              <span className="text-foreground font-medium">R$ {amount}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">Taxa</span>
              <span className="text-destructive font-medium">- R$ 4,90</span>
            </div>
            <div className="border-t border-border my-3" />
            <div className="flex justify-between text-sm font-bold">
              <span className="text-foreground">Você receberá</span>
              <span className="text-primary text-base">R$ {(numericAmount - 4.9).toFixed(2).replace(".", ",")}</span>
            </div>
          </motion.div>
        )}

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-2"
        >
          <Button
            onClick={handleWithdraw}
            disabled={!isValid || loading}
            className="w-full h-13 bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 font-bold text-sm disabled:opacity-30 rounded-xl shadow-glow"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Confirmar Saque via Pix
              </>
            )}
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Withdrawal;
