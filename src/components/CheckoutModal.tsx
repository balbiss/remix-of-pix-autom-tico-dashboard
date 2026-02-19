import { useState, useEffect } from "react";
import { Copy, Check, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckoutModal = ({ open, onOpenChange }: CheckoutModalProps) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const { toast } = useToast();
  const pixCode = "00020126580014br.gov.bcb.pix0136example-pix-key-placeholder5204000053039865802BR5925PIX AUTOMATICO LTDA6009SAO PAULO62070503***6304ABCD";

  useEffect(() => {
    if (!open) {
      setTimeLeft(15 * 60);
      return;
    }
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
  }, [open, onOpenChange, toast]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopy = () => {
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
          {/* QR Code Placeholder */}
          <div className="bg-foreground rounded-2xl p-5 mx-auto w-48 h-48 flex items-center justify-center shadow-lg">
            <div className="text-background text-center">
              <div className="grid grid-cols-5 gap-1 mb-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-sm ${
                      [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23, 24].includes(i)
                        ? "bg-background"
                        : "bg-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-background/50 font-medium">QR Code Pix</p>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-muted-foreground text-xs font-medium">Valor a pagar</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">R$ 19,90</p>
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
