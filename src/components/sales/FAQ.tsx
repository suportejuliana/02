import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "O que e o Colageno Verisol?", a: "E um suplemento alimentar em po com Peptideos Bioativos de Colageno Verisol, Acido Hialuronico e um complexo de Vitaminas e Minerais, desenvolvido para pele, unhas e cabelos." },
  { q: "Para que serve?", a: "Auxilia na reducao de rugas, aumento da elasticidade e firmeza da pele, fortalecimento de unhas e cabelos, e hidratacao profunda com acido hialuronico." },
  { q: "Como devo tomar?", a: "Dissolva uma porcao (conforme indicacao na embalagem) em agua ou suco e consuma preferencialmente pela manha ou conforme orientacao profissional." },
  { q: "Em quanto tempo vejo resultados?", a: "Estudos com Verisol mostram resultados visiveis a partir de 4 a 8 semanas de uso continuo. Muitas clientes relatam melhoras ja nas primeiras semanas." },
  { q: "Qual o sabor?", a: "Abacaxi com Hortela. Sabor agradavel e refrescante, facil de consumir no dia a dia." },
  { q: "Contem gluten ou lactose?", a: "Nao contem gluten e nao contem lactose. Porem, e produzido em equipamento onde se processam derivados de leite e soja." },
  { q: "Quais os ingredientes?", a: "Colageno Hidrolisado, Peptideos Bioativos Verisol, Acido Hialuronico, Vitamina C, Coenzima Q10, Vitamina E, Zinco, Silicio, Vitamina A, Biotina, Selenio, com aroma natural de abacaxi com hortela." },
  { q: "Tem efeitos colaterais?", a: "O colageno Verisol e seguro e bem tolerado. Consulte um profissional de saude em caso de duvidas ou se estiver gestante/lactante." },
  { q: "E um medicamento?", a: "Nao. Este produto e um suplemento alimentar e nao substitui uma alimentacao equilibrada." },
  { q: "Posso tomar todos os dias?", a: "Sim, o uso continuo diario e recomendado para melhores resultados." },
  { q: "Qual a quantidade por embalagem?", a: "Cada embalagem contem 200g de produto em po." },
];

const FAQ = () => (
  <section className="bg-muted py-10">
    <div className="container">
      <h2 className="text-xl font-extrabold text-foreground text-center mb-6">Perguntas Frequentes</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-4">
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline hover:text-primary">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
