const ingredients = [
  { num: "01", name: "Colageno Verisol (Peptideos Bioativos)", desc: "Peptideos de colageno hidrolisado com peso molecular de 2kDa, otimizados para absorcao e acao direta na pele." },
  { num: "02", name: "Acido Hialuronico", desc: "Hialuronato de Sodio que promove hidratacao profunda, preenchimento e elasticidade da pele." },
  { num: "03", name: "Vitamina C + Coenzima Q10", desc: "Antioxidantes poderosos que promovem regeneracao celular e luminosidade a pele." },
  { num: "04", name: "Zinco + Silicio + Biotina", desc: "Complexo que fortalece unhas e cabelos, melhorando resistencia e aparencia." },
  { num: "05", name: "Vitamina A + Vitamina E", desc: "Vitaminas essenciais para a saude da pele, combatendo radicais livres e o envelhecimento precoce." },
  { num: "06", name: "Selenio", desc: "Mineral antioxidante que protege as celulas contra danos oxidativos e auxilia na manutencao da pele saudavel." },
];

const Ingredients = () => (
  <section className="py-10" style={{ background: "linear-gradient(to bottom, hsl(280, 40%, 12%), hsl(280, 50%, 30%))" }}>
    <div className="container">
      <h2 className="text-xl font-extrabold text-white text-center mb-1">
        Formula completa para <span className="text-primary">rejuvenescimento</span>
      </h2>
      <p className="text-sm text-white/70 text-center mb-6">
        Ingredientes premium para pele, unhas e cabelos
      </p>

      <div className="space-y-3">
        {ingredients.map((ing) => (
          <div key={ing.num} className="bg-background/40 backdrop-blur-sm rounded-xl p-4 flex items-start gap-4 border border-primary/20">
            <span className="text-2xl font-black text-primary">{ing.num}</span>
            <div className="flex-1">
              <span className="font-bold text-white text-sm">{ing.name}</span>
              <p className="text-xs text-white/70 mt-1">{ing.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Ingredients;
