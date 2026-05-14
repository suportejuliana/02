import { Sparkles, Droplets, Hand, Heart } from "lucide-react";

const benefits = [
  { icon: Sparkles, title: "Reducao de Rugas", desc: "Ajuda a suavizar linhas finas e rugas, promovendo uma pele mais jovem e radiante." },
  { icon: Droplets, title: "Hidratacao Profunda", desc: "Acido hialuronico mantem a pele jovem e hidratada de dentro para fora." },
  { icon: Hand, title: "Unhas e Cabelos Fortes", desc: "Zinco, Silicio e Biotina melhoram a resistencia e aparencia de unhas e cabelos." },
  { icon: Heart, title: "Firmeza e Elasticidade", desc: "Peptideos bioativos Verisol promovem firmeza e elasticidade na pele." },
];

const Benefits = () => (
  <section className="container py-10">
    <h2 className="text-xl font-extrabold text-foreground text-center mb-1">
      Por que escolher <span className="text-primary">Colageno Verisol Nutrilibrium</span>?
    </h2>
    <p className="text-sm text-muted-foreground text-center mb-6">Formula avancada com peptideos bioativos para rejuvenescimento completo</p>

    <div className="grid grid-cols-2 gap-3 mb-6">
      {benefits.map((b) => (
        <div key={b.title} className="bg-card rounded-xl p-4 text-center border border-border shadow-sm hover:border-primary/30 transition-colors">
          <b.icon className="w-8 h-8 text-foreground mx-auto mb-2" />
          <h3 className="font-bold text-sm text-foreground mb-1">{b.title}</h3>
          <p className="text-xs text-muted-foreground">{b.desc}</p>
        </div>
      ))}
    </div>

    <a href="#pricing-kits" onClick={(e) => { e.preventDefault(); document.getElementById('kit-destaque')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-cta hover:bg-cta-hover text-cta-foreground font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cta/20">
      <Sparkles className="w-5 h-5" />QUERO REJUVENESCER AGORA
    </a>
    <p className="text-center text-xs text-muted-foreground mt-1.5">Apenas 15 unidades disponiveis com esse preco</p>
  </section>
);

export default Benefits;
