import { Sparkles, AlertTriangle } from "lucide-react";

const StickyCart = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3">
    <div className="max-w-[768px] mx-auto">
      <a href="#pricing-kits" onClick={(e) => { e.preventDefault(); document.getElementById('kit-destaque')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-cta hover:bg-cta-hover text-cta-foreground font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-base shadow-lg shadow-cta/20">
        <Sparkles className="w-5 h-5" />QUERO REJUVENESCER AGORA
      </a>
      <p className="text-center text-xs text-primary mt-1.5 flex items-center justify-center gap-1 font-medium">
        <AlertTriangle className="w-3.5 h-3.5" />Ultimas 15 unidades
      </p>
    </div>
  </div>
);

export default StickyCart;
