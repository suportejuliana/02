import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, User, Mail, FileText, Phone, MapPin, Hash, Building, Home, CreditCard, ShieldCheck, Lock, Clock, CheckCircle2, Smartphone, Loader2, Copy, Check, AlertCircle, PartyPopper } from "lucide-react";
import { captureUtms, trackPurchase } from "@/lib/utmify";
import kitImg1 from "@/assets/kit-1.jpeg";
import kitImg2 from "@/assets/kit-2.jpeg";
import kitImg3 from "@/assets/kit-3.jpeg";

const API_URL = "/.netlify/functions/create-pix-charge";

const kitMap: Record<string, { title: string; price: number; originalPrice: number; image: string; productId: string; quantity: number }> = {
  "1": { title: "1 Colageno Verisol 200g", price: 47.90, originalPrice: 99.98, image: kitImg1, productId: "a1c76d0b-779d-40f9-8b53-e930fcb3677a", quantity: 1 },
  "2": { title: "2 Colageno Verisol 200g", price: 69.90, originalPrice: 199.90, image: kitImg2, productId: "a1c76da4-375c-4c8c-bf57-fb0169ff9323", quantity: 1 },
  "3": { title: "3 Colageno Verisol 200g", price: 109.90, originalPrice: 299.98, image: kitImg3, productId: "a1c76e50-88c9-432c-83a6-7dfacc07e2e0", quantity: 1 },
};

const formatBRL = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

const maskCPF = (v: string) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").slice(0, 14);
const maskPhone = (v: string) => { const d = v.replace(/\D/g, ""); if (d.length <= 2) return `(${d}`; if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`; };
const maskCEP = (v: string) => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);

const isValidCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10]);
};

const normalizeQrCodeSrc = (v?: string) =>
  !v ? "" : v.startsWith("data:image") ? v : `data:image/png;base64,${v}`;

const extractPixPayload = (response: any) => {
  const payload = response?.data ?? response;
  const pix = payload?.pix ?? {};
  return {
    qrCodeText: pix.code ?? payload?.pix_qr_code ?? response?.pix_qr_code ?? "",
    qrCodeImage: pix.qr_code_base64 ?? payload?.pix_qr_code_base64 ?? response?.pix_qr_code_base64 ?? "",
    orderId: payload?.order_id ?? payload?.order_uuid ?? response?.order_id ?? response?.order_uuid ?? "",
    status: payload?.status ?? response?.status ?? "",
    message: response?.message ?? payload?.message ?? "",
  };
};

type Step = "form" | "loading" | "qrcode" | "paid" | "error";

const estados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const ACCENT = "#8B5CF6";
const ACCENT_HOVER = "#7C3AED";

const Checkout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const kitId = params.get("kit") || "1";
  const kit = kitMap[kitId] || kitMap["1"];

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ nome: "", email: "", cpf: "", celular: "", cep: "", estado: "", cidade: "", bairro: "", rua: "", numero: "", complemento: "" });
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeText: string; orderId: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => { captureUtms(); }, []);

  const handleCEP = async (cep: string) => {
    const masked = maskCEP(cep);
    update("cep", masked);
    const digits = masked.replace(/\D/g, "");
    if (digits.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setForm((f) => ({ ...f, cep: masked, estado: data.uf || "", cidade: data.localidade || "", bairro: data.bairro || "", rua: data.logradouro || "" }));
        }
      } catch {}
    }
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.cpf || !form.celular) {
      setErrorMsg("Preencha todos os dados pessoais.");
      setStep("error");
      return;
    }
    if (!isValidCPF(form.cpf)) {
      setErrorMsg("CPF invalido. Verifique e tente novamente.");
      setStep("error");
      return;
    }

    setStep("loading");
    try {
      const utm = captureUtms();
      const payload = {
        name: form.nome.trim(),
        email: form.email.trim(),
        phone: form.celular.replace(/\D/g, ""),
        cpf: form.cpf.replace(/\D/g, ""),
        items: [{ id: kit.productId, value: Math.round(kit.price * 100), quantity: kit.quantity }],
        ...(Object.keys(utm).length > 0 ? { utm } : {}),
      };

      const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX");

      const { qrCodeText, qrCodeImage, orderId, message } = extractPixPayload(data);
      if (!qrCodeText) throw new Error(message || "Codigo Pix nao retornado. Tente novamente.");

      setPixData({ qrCode: normalizeQrCodeSrc(qrCodeImage), qrCodeText, orderId });
      setStep("qrcode");
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao processar pagamento. Tente novamente.");
      setStep("error");
    }
  };

  useEffect(() => {
    if (step !== "qrcode" || !pixData?.orderId) return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "status", order_id: pixData.orderId }) });
        const data = await res.json();
        const status = String(data?.data?.status ?? data?.status ?? "").toLowerCase();
        if (res.ok && ["paid", "approved", "completed"].includes(status)) {
          trackPurchase({
            orderId: pixData.orderId,
            value: kit.price,
            email: form.email,
            phone: form.celular.replace(/\D/g, ""),
            name: form.nome,
          });

          const utm = captureUtms();
          fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "utmify",
              orderId: pixData.orderId,
              value: kit.price,
              customer: { name: form.nome, email: form.email, phone: form.celular.replace(/\D/g, ""), cpf: form.cpf.replace(/\D/g, "") },
              utm,
              product: { name: kit.title, plan: kit.title, quantity: kit.quantity },
            }),
          }).catch(() => {});

          setStep("paid");
          clearInterval(poll);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(poll);
  }, [step, pixData?.orderId]);

  const handleCopy = () => {
    if (!pixData?.qrCodeText) return;
    navigator.clipboard.writeText(pixData.qrCodeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#f0f2f5] max-w-[768px] mx-auto flex items-center justify-center">
        <div className="text-center p-8">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: ACCENT }} />
          <p className="font-bold text-gray-800">Gerando seu PIX...</p>
          <p className="text-sm text-gray-500 mt-1">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  if (step === "qrcode") {
    return (
      <div className="min-h-screen bg-[#f0f2f5] max-w-[768px] mx-auto">
        <div className="px-4 py-3">
          <button onClick={() => setStep("form")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
        <div className="mx-4 mb-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: ACCENT }}>
              <CreditCard className="w-3.5 h-3.5" />
            </span>
            <h2 className="font-bold text-gray-800">Pague com PIX</h2>
          </div>
          <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
            {pixData?.qrCode ? (
              <img src={pixData.qrCode} alt="QR Code PIX" className="w-48 h-48" />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-xs text-gray-500">QR Code</p>
              </div>
            )}
            <p className="text-xs text-gray-500 text-center">Escaneie o QR Code acima com o app do seu banco</p>
          </div>
          <div className="mb-4">
            <label className="text-xs text-gray-500 font-medium mb-1 block">Ou copie o codigo Pix:</label>
            <div className="flex gap-2">
              <input type="text" readOnly value={pixData?.qrCodeText || ""} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 truncate" />
              <button onClick={handleCopy} className="px-4 py-2.5 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1" style={{ backgroundColor: copied ? ACCENT_HOVER : ACCENT }}>
                {copied ? <><Check className="w-3.5 h-3.5" /> Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
              </button>
            </div>
          </div>
          <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: `${ACCENT}0d` }}>
            <p className="font-bold text-gray-800 text-sm mb-2">Como pagar com PIX:</p>
            <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
              <li>Abra o app do seu banco</li>
              <li>Procure a opcao PIX ou escanear QR Code</li>
              <li>Escaneie o codigo acima ou cole o codigo copiado</li>
              <li>Confirme o pagamento</li>
            </ol>
          </div>
          <div className="flex items-center justify-center gap-2 py-3 bg-yellow-50 rounded-xl border border-yellow-200">
            <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />
            <p className="text-sm text-yellow-700 font-medium">Aguardando pagamento...</p>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-gray-500 text-sm">Total:</span>
            <span className="text-gray-400 line-through text-sm">{formatBRL(kit.originalPrice)}</span>
            <span className="font-bold text-lg" style={{ color: ACCENT }}>{formatBRL(kit.price)}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 py-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Compra segura</div>
          <div className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Dados protegidos</div>
        </div>
      </div>
    );
  }

  if (step === "paid") {
    return (
      <div className="min-h-screen bg-[#f0f2f5] max-w-[768px] mx-auto flex items-center justify-center">
        <div className="mx-4 bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pagamento confirmado!</h2>
          <p className="text-sm text-gray-500 mb-1">Seu pedido foi recebido com sucesso.</p>
          <p className="text-sm text-gray-500 mb-6">Voce recebera os detalhes por e-mail em breve.</p>
          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
            <p className="text-sm text-green-700 font-medium">{kit.title}</p>
            <p className="text-lg font-bold text-green-800">{formatBRL(kit.price)}</p>
          </div>
          <button onClick={() => navigate("/")} className="w-full text-white font-bold py-3.5 rounded-xl transition-colors text-sm" style={{ backgroundColor: ACCENT }}>
            Voltar ao inicio
          </button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-[#f0f2f5] max-w-[768px] mx-auto flex items-center justify-center">
        <div className="mx-4 bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ops, algo deu errado</h2>
          <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>
          <button onClick={() => setStep("form")} className="w-full text-white font-bold py-3.5 rounded-xl transition-colors text-sm" style={{ backgroundColor: ACCENT }}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] max-w-[768px] mx-auto">
      <div className="px-4 py-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
      </div>
      <div className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold mb-2" style={{ color: ACCENT }}>Voce esta comprando:</p>
        <div className="flex items-center gap-3">
          {kit.image && <img src={kit.image} alt={kit.title} className="w-12 h-12 rounded-lg object-cover" />}
          <div>
            <p className="font-semibold text-gray-800 text-sm">{kit.title}</p>
            <p className="font-bold text-gray-900">{formatBRL(kit.price)}</p>
          </div>
        </div>
      </div>
      <div className="mx-4 mb-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: ACCENT }}>1</span>
          <h2 className="font-bold text-gray-800">Dados pessoais</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Nome completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Digite seu nome completo" value={form.nome} onChange={(e) => update("nome", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="Digite seu melhor e-mail" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">CPF</label>
            <input type="text" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => update("cpf", maskCPF(e.target.value))} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Celular</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="(99) 99999-9999" value={form.celular} onChange={(e) => update("celular", maskPhone(e.target.value))} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 mb-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: ACCENT }}>2</span>
          <h2 className="font-bold text-gray-800">Endereco</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">CEP</label>
              <input type="text" placeholder="Digite o CEP" value={form.cep} onChange={(e) => handleCEP(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Estado</label>
              <select value={form.estado} onChange={(e) => update("estado", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors bg-white text-gray-600">
                <option value="">Selecione...</option>
                {estados.map((uf) => (<option key={uf} value={uf}>{uf}</option>))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Cidade</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Digite a cidade" value={form.cidade} onChange={(e) => update("cidade", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Bairro</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Digite o bairro" value={form.bairro} onChange={(e) => update("bairro", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Rua</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Digite o nome da rua" value={form.rua} onChange={(e) => update("rua", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Numero</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="No" value={form.numero} onChange={(e) => update("numero", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Complemento</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Apto, Bloco, etc" value={form.complemento} onChange={(e) => update("complemento", e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/20 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 mb-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: ACCENT }}>3</span>
            <h2 className="font-bold text-gray-800">Pagamento</h2>
          </div>
          <span className="text-xs text-gray-400">Pix</span>
        </div>
        <div className="border-2 rounded-xl p-4 flex items-center justify-center gap-2 mb-5" style={{ borderColor: ACCENT, backgroundColor: `${ACCENT}0d` }}>
          <CreditCard className="w-5 h-5" style={{ color: ACCENT }} />
          <span className="font-semibold text-sm" style={{ color: ACCENT }}>Pix</span>
        </div>
        <h3 className="font-bold text-gray-800 mb-3">Pague no Pix</h3>
        <div className="space-y-4 mb-5">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: ACCENT }} />
            <div>
              <p className="font-bold text-xs" style={{ color: ACCENT }}>IMEDIATO</p>
              <p className="text-xs text-gray-500">Ao selecionar a opcao Gerar Pix o codigo para pagamento estara disponivel.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: ACCENT }} />
            <div>
              <p className="font-bold text-xs" style={{ color: ACCENT }}>PAGAMENTO SIMPLES</p>
              <p className="text-xs text-gray-500">Para pagar basta abrir o aplicativo do seu banco, procurar pelo Pix e escanear o QRcode.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: ACCENT }} />
            <div>
              <p className="font-bold text-xs" style={{ color: ACCENT }}>100% SEGURO</p>
              <p className="text-xs text-gray-500">O Pix foi desenvolvido pelo Banco Central para facilitar suas compras e e 100% seguro.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-sm" style={{ color: ACCENT }}>Total:</span>
          <span className="text-gray-400 line-through text-sm">{formatBRL(kit.originalPrice)}</span>
          <span className="font-bold text-lg" style={{ color: ACCENT }}>{formatBRL(kit.price)}</span>
        </div>
        <button onClick={handleSubmit} className="w-full text-white font-bold py-4 rounded-xl transition-colors text-sm shadow-lg" style={{ backgroundColor: ACCENT }}>
          Gerar Pix
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">Criptografado e ambiente 100% seguro.</p>
      </div>
      <div className="flex items-center justify-center gap-6 py-6 text-xs text-gray-400">
        <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Compra segura</div>
        <div className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Dados protegidos</div>
      </div>
    </div>
  );
};

export default Checkout;
