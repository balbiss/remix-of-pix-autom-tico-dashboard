import { useState, useEffect } from "react";
import { Copy, Check, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId?: string;
  planName?: string;
  planPrice?: number;
}

const CheckoutModal = ({ open, onOpenChange, planId, planName, planPrice }: CheckoutModalProps) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [pixCode, setPixCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setTimeLeft(15 * 60);
      setPixCode("");
      setQrCode("");
      return;
    }

    const loadCharge = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-charge', {
          body: { amount: planPrice, planId: planId }
        });

        if (error) throw error;

        // Adjust these fields based on the actual SyncPay response structure
        // Usually it's something like { payload: "0002...", qrcode_base64: "..." }
        setPixCode(data.payload || data.brcode || "");
        setQrCode(data.qrcode_base64 || "");

      } catch (err: any) {
        toast({
          title: "Erro ao gerar Pix",
          description: err.message || "Tente novamente mais tarde.",
          variant: "destructive"
        });
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };

    loadCharge();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onOpenChange(false);
          toast({ title: "Pix expirado", description: "O tempo para pagamento expirou. Tente novamente." });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open, onOpenChange, toast, planId, planPrice]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopy = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({ title: "Código copiado!", description: "Cole no seu app do banco para pagar." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto rounded-3xl p-0 overflow-hidden">
        {/* Header bar */}
        <div className="bg-gradient-primary p-5 pb-4">
          <DialogHeader>
            <DialogTitle className="text-primary-foreground font-display text-center text-lg">
              Pagamento via Pix
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center gap-2 mt-3 bg-primary-foreground/15 rounded-xl p-2.5 backdrop-blur-sm">
            <Clock className="h-4 w-4 text-primary-foreground" />
            <span className="text-base font-mono font-bold text-primary-foreground">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-xs text-primary-foreground/70">para expirar</span>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-white rounded-2xl p-5 mx-auto w-48 h-48 flex items-center justify-center shadow-lg relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Gerando Pix...</p>
              </div>
            ) : qrCode ? (
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="Pix QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-[10px] text-destructive font-bold uppercase">Falha ao carregar QR Code</p>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-muted-foreground text-xs font-medium">Valor a pagar</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">
              R$ {planPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Copy Paste */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pix Copia e Cola</p>
            <div className="bg-muted rounded-xl p-3.5 text-xs text-muted-foreground font-mono break-all leading-relaxed max-h-16 overflow-y-auto border border-border">
              {pixCode}
            </div>
            <Button
              onClick={handleCopy}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 font-bold rounded-xl shadow-glow"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" /> Copiar Código Pix
                </>
              )}
            </Button>
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground/60">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[10px] font-medium">Pagamento seguro via Pix</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
