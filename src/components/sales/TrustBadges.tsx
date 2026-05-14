import { Truck, ShieldCheck, Award } from "lucide-react";

const badges = [
  { icon: Truck, title: "Frete Gratis", subtitle: "Todo Brasil" },
  { icon: ShieldCheck, title: "Compra Segura", subtitle: "Criptografia SSL" },
  { icon: Award, title: "Sem Gluten e Lactose", subtitle: "Formula Premium" },
];

const TrustBadges = () => (
  <section className="container py-6">
    <div className="grid grid-cols-3 gap-3">
      {badges.map((b) => (
        <div key={b.title} className="flex flex-col items-center text-center gap-1.5">
          <b.icon className="w-7 h-7 text-foreground" />
          <span className="text-xs font-bold text-foreground">{b.title}</span>
          <span className="text-[10px] text-muted-foreground">{b.subtitle}</span>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBadges;
