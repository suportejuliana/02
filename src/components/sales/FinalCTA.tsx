import { useEffect, useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

const FinalCTA = () => {
  const [time, setTime] = useState({ hours: 1, minutes: 54, seconds: 19 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 0; minutes = 0; seconds = 0; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-background py-10">
      <div className="container text-center">
        <h2 className="text-xl font-extrabold text-foreground mb-1">Nao deixe sua beleza para depois</h2>
        <p className="text-muted-foreground text-sm mb-4">Garanta agora seu Colageno Verisol e rejuvenesca de dentro para fora</p>
        <a href="#pricing-kits" onClick={(e) => { e.preventDefault(); document.getElementById('kit-destaque')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-cta hover:bg-cta-hover text-cta-foreground font-bold text-lg py-4 rounded-xl animate-pulse-glow transition-colors flex items-center justify-center gap-2 mb-3 shadow-lg shadow-cta/20">
          <Sparkles className="w-5 h-5" />QUERO REJUVENESCER AGORA
        </a>
        <p className="text-muted-foreground text-sm mb-2">
          Oferta termina em{" "}
          <span className="font-mono font-bold text-primary">{pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}</span>
        </p>
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
          <ShieldCheck className="w-4 h-4" />Pagamento 100% seguro · Seus dados estao protegidos
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
