import { AlertTriangle, Sparkles } from "lucide-react";

const UrgencyBanner = () => (
  <section className="container py-8">
    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-primary" />
        <h3 className="font-extrabold text-foreground text-center">ATENCAO: Estoque quase esgotado!</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Restam apenas <strong className="text-foreground">15 unidades</strong> com preco promocional. Depois, volta ao preco original.
      </p>
      <a href="#pricing-kits" onClick={(e) => { e.preventDefault(); document.getElementById('kit-destaque')?.scrollIntoView({ behavior: 'smooth' }); }}
        className="w-full bg-cta hover:bg-cta-hover text-cta-foreground font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
        <Sparkles className="w-5 h-5" />Oferta por Tempo Limitado
      </a>
    </div>
  </section>
);

export default UrgencyBanner;
