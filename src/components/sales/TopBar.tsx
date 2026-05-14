import { useEffect, useState } from "react";
import { Truck, Sparkles } from "lucide-react";

const TopBar = () => {
  const [time, setTime] = useState({ hours: 1, minutes: 54, seconds: 9 });

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
    <div className="bg-topbar text-topbar-foreground py-1.5 px-3 flex items-center justify-between text-[10px] font-semibold sticky top-0 z-50 border-b border-border">
      <div className="flex items-center gap-1.5">
        <Truck className="w-3.5 h-3.5 shrink-0" />
        <div className="flex flex-col leading-tight">
          <span>FRETE GRATIS</span>
          <span>OFERTA LIMITADA</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="whitespace-nowrap">ACABA EM:</span>
        <div className="flex items-center gap-0.5 font-mono whitespace-nowrap">
          <span className="bg-primary px-1 py-0.5 rounded text-[10px] text-primary-foreground">{pad(time.hours)}</span>
          <span>:</span>
          <span className="bg-primary px-1 py-0.5 rounded text-[10px] text-primary-foreground">{pad(time.minutes)}</span>
          <span>:</span>
          <span className="bg-primary px-1 py-0.5 rounded text-[10px] text-primary-foreground">{pad(time.seconds)}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
