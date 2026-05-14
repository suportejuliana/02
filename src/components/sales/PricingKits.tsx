import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";
import kitImg1 from "@/assets/kit-1.jpeg";
import kitImg2 from "@/assets/kit-2.jpeg";
import kitImg3 from "@/assets/kit-3.jpeg";

const FLAVORS = ["Frutas Vermelhas", "Laranja com Acerola", "Abacaxi com Hortela"];

const kits = [
  { badge: "1 UNIDADE", title: "1 Colageno Verisol 200g", subtitle: "Peptideos bioativos + acido hialuronico para pele firme e radiante", price: 47.90, originalPrice: 99.98, discount: 52, perUnit: null as number | null, highlight: false, extraBadge: null as string | null, image: kitImg1, kit: "1", qty: 1 },
  { badge: "MAIS VENDIDO — MAIOR ECONOMIA", title: "2 Colageno Verisol 200g", subtitle: "Mais economia para uso continuo e resultados visiveis", price: 69.90, originalPrice: 199.90, discount: 65, perUnit: 34.95, highlight: true, extraBadge: "MELHOR CUSTO-BENEFICIO", image: kitImg2, kit: "2", qty: 2 },
  { badge: "COMBO COMPLETO + BRINDE", title: "3 Colageno Verisol 200g + Brinde", subtitle: "Combo completo para rejuvenescimento total + brinde exclusivo", price: 109.90, originalPrice: 299.98, discount: 63, perUnit: null, highlight: false, extraBadge: null, image: kitImg3, kit: "3", qty: 3 },
];

const FlavorSelector = ({ qty, selections, onChange }: { qty: number; selections: string[]; onChange: (s: string[]) => void }) => (
  <div className="mt-3 space-y-2">
    {Array.from({ length: qty }).map((_, idx) => (
      <div key={idx}>
        <label className="text-xs text-muted-foreground font-medium mb-1 block">
          {qty === 1 ? "Escolha seu sabor:" : `Sabor ${idx + 1}:`}
        </label>
        <select
          value={selections[idx] || ""}
          onChange={(e) => {
            const next = [...selections];
            next[idx] = e.target.value;
            onChange(next);
          }}
          className="w-full px-3 py-2.5 border-2 border-purple-200 rounded-lg text-sm bg-white text-foreground focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors"
        >
          <option value="">Selecione o sabor...</option>
          {FLAVORS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
    ))}
  </div>
);

const PricingKits = () => {
  const navigate = useNavigate();
  const [flavors, setFlavors] = useState<Record<string, string[]>>({
    "1": [""],
    "2": ["", ""],
    "3": ["", "", ""],
  });

  const updateFlavors = (kitId: string, selections: string[]) => {
    setFlavors((prev) => ({ ...prev, [kitId]: selections }));
  };

  const allSelected = (kitId: string, qty: number) => {
    const sel = flavors[kitId] || [];
    return sel.length === qty && sel.every((s) => s !== "");
  };

  const handleBuy = (kit: typeof kits[0]) => {
    if (!allSelected(kit.kit, kit.qty)) return;
    const sabores = encodeURIComponent(flavors[kit.kit].join(","));
    navigate(`/checkout?kit=${kit.kit}&sabores=${sabores}`);
  };

  return (
    <section id="pricing-kits" className="container py-10">
      <h2 className="text-xl font-extrabold text-foreground text-center mb-1">Escolha seu Kit Ideal</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">Quanto mais frascos, <strong className="text-foreground">maior a economia</strong></p>

      <div className="space-y-4">
        {kits.map((kit) => {
          const ready = allSelected(kit.kit, kit.qty);
          return (
            <div key={kit.title} id={kit.highlight ? "kit-destaque" : undefined} className={`rounded-2xl border-2 p-4 relative bg-card shadow-sm ${kit.highlight ? "border-[#5B21B6] shadow-lg shadow-[#5B21B6]/10" : "border-border"}`}>
              <span className="bg-[#5B21B6] text-white text-[10px] font-bold px-2.5 py-1 rounded-full absolute -top-3 left-4">{kit.badge}</span>
              {kit.extraBadge && (<span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full mt-3 mb-1">{kit.extraBadge}</span>)}
              <div className={`${kit.extraBadge ? "mt-1" : "mt-2"}`}>
                <div className="flex justify-center mb-3"><img src={kit.image} alt={kit.title} className="object-contain max-h-[180px] w-auto rounded-2xl" /></div>
                <div>
                  <h3 className="font-bold text-foreground">{kit.title}</h3>
                  <p className="text-xs text-muted-foreground">{kit.subtitle}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-black text-foreground">R$ {kit.price.toFixed(2).replace(".", ",")}</span>
                    <span className="text-xs bg-[#8B5CF6] text-white font-bold px-1.5 py-0.5 rounded">-{kit.discount}% OFF</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="line-through">R$ {kit.originalPrice.toFixed(2).replace(".", ",")}</span>
                    {kit.perUnit && <span>(R$ {kit.perUnit.toFixed(2).replace(".", ",")}/un)</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-[#22C35D] font-semibold">Frete Gratis</span>
                    <span className="text-muted-foreground">Entrega rapida</span>
                  </div>
                </div>
              </div>

              <FlavorSelector
                qty={kit.qty}
                selections={flavors[kit.kit]}
                onChange={(s) => updateFlavors(kit.kit, s)}
              />

              <button
                onClick={() => handleBuy(kit)}
                disabled={!ready}
                className={`w-full mt-3 font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-lg ${ready ? "bg-cta hover:bg-cta-hover text-cta-foreground animate-pulse-glow shadow-cta/20" : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"}`}
              >
                <Sparkles className="w-4 h-4" />{ready ? "COMPRAR AGORA" : `SELECIONE ${kit.qty === 1 ? "O SABOR" : `OS ${kit.qty} SABORES`}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-foreground" />Pagamento 100% seguro · Seus dados protegidos
      </div>
    </section>
  );
};

export default PricingKits;
