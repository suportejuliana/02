import { ShieldCheck, Truck, RefreshCw, Award } from "lucide-react";

const guarantees = [
  { icon: ShieldCheck, title: "Compra 100% Segura", desc: "Seus dados protegidos com criptografia de ponta" },
  { icon: Truck, title: "Frete Gratis via Sedex", desc: "Entrega em 2 a 5 dias uteis para todo Brasil" },
  { icon: RefreshCw, title: "Garantia de 30 dias", desc: "Satisfacao garantida ou dinheiro de volta" },
  { icon: Award, title: "Sem Gluten e Lactose", desc: "Formula premium de maxima qualidade" },
];

const Guarantees = () => (
  <section className="py-10">
    <div className="container">
      <h2 className="text-xl font-extrabold text-foreground text-center mb-6">Nossas Garantias</h2>
      <div className="grid grid-cols-2 gap-3">
        {guarantees.map((g) => (
          <div key={g.title} className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
            <g.icon className="w-8 h-8 text-foreground mx-auto mb-2" />
            <h3 className="font-bold text-sm text-foreground mb-1">{g.title}</h3>
            <p className="text-xs text-muted-foreground">{g.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Guarantees;
