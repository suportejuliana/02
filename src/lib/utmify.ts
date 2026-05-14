const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORAGE_KEY = "utmify_utms";
export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export const captureUtms = (): UtmParams => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) fromUrl[k] = v;
  });
  if (Object.keys(fromUrl).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {}
    return fromUrl;
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as UtmParams;
  } catch {}
  return {};
};

export const trackPurchase = (params: {
  orderId: string;
  value: number;
  email?: string;
  phone?: string;
  name?: string;
}) => {
  if (typeof window === "undefined") return;
  const w = window as any;
  const payload = { ...params, currency: "BRL" };
  try {
    if (typeof w.utmify === "function") w.utmify("track", "Purchase", payload);
    else if (w.utmify?.track) w.utmify.track("Purchase", payload);
    if (typeof w.fbq === "function") w.fbq("track", "Purchase", { value: params.value, currency: "BRL" });
  } catch (e) {
    console.warn("trackPurchase error", e);
  }
};
