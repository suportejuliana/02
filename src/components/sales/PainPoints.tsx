import { X, CheckCircle } from "lucide-react";

const problems = [
  "Rugas e linhas finas que aparecem cada vez mais",
  "Unhas fracas e quebradicas que nao crescem",
  "Cabelos caindo, finos e sem vida",
  "Pele flacida e sem firmeza, com perda de elasticidade",
  "Pele seca e sem hidratacao, aparencia envelhecida",
];

const PainPoints = () => (
  <section className="bg-muted py-10">
    <div className="container">
      <h2 className="text-xl font-extrabold text-foreground text-center mb-6">
        Voce sofre com sinais de envelhecimento e pele sem vida?
      </h2>
      <div className="space-y-3 mb-6">
        {problems.map((p) => (
          <div key={p} className="flex items-start gap-3 bg-card rounded-lg p-3 shadow-sm border border-border">
            <X className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{p}</span>
          </div>
        ))}
      </div>
      <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl p-4 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-[#22C55E] shrink-0" />
        <p className="text-sm font-bold text-foreground">O Colageno Verisol com Acido Hialuronico combate os sinais do envelhecimento de dentro para fora</p>
      </div>
    </div>
  </section>
);

export default PainPoints;
