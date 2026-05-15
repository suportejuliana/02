const FRUITFY_API_URL = "https://api.fruitfy.io/api";
const FRUITFY_API_TOKEN = process.env.FRUITFY_API_TOKEN;
const FRUITFY_STORE_ID = process.env.FRUITFY_STORE_ID;
const UTMIFY_API_TOKEN = process.env.UTMIFY_API_TOKEN;
const UTMIFY_API_URL = "https://api.utmify.com.br/api-credentials/orders";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    if (!FRUITFY_API_TOKEN || !FRUITFY_STORE_ID) {
      throw new Error("Fruitfy secrets not configured");
    }

    const bodyData = JSON.parse(event.body || "{}");
    const action = bodyData.action;

    // === MODO UTMIFY — Enviar venda para UTMify ===
    if (action === "utmify") {
      if (!UTMIFY_API_TOKEN) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true, skipped: true, reason: "UTMIFY_API_TOKEN not configured" }) };
      }

      const { orderId, value, customer, utm, product } = bodyData;

      const utmifyPayload = {
        orderId: orderId || "",
        platform: "Outros",
        paymentMethod: "pix",
        status: "approved",
        createdAt: new Date().toISOString(),
        approvedDate: new Date().toISOString(),
        customer: {
          name: customer?.name || "",
          email: customer?.email || "",
          phone: customer?.phone || "",
          document: customer?.cpf || "",
        },
        products: [
          {
            name: product?.name || "Colageno Verisol",
            planName: product?.plan || "",
            quantity: product?.quantity || 1,
            priceInCents: Math.round((value || 0) * 100),
          },
        ],
        trackingParameters: {
          src: utm?.utm_source || "",
          utm_source: utm?.utm_source || "",
          utm_medium: utm?.utm_medium || "",
          utm_campaign: utm?.utm_campaign || "",
          utm_content: utm?.utm_content || "",
          utm_term: utm?.utm_term || "",
        },
        commission: {
          totalPriceInCents: Math.round((value || 0) * 100),
          gatewayFeeInCents: 0,
          myCommissionInCents: Math.round((value || 0) * 100),
        },
      };

      try {
        const response = await fetch(UTMIFY_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": UTMIFY_API_TOKEN,
          },
          body: JSON.stringify(utmifyPayload),
        });
        const data = await response.json();
        console.log("UTMify response:", response.status, JSON.stringify(data));
        return { statusCode: 200, headers, body: JSON.stringify({ ok: response.ok, utmify: data }) };
      } catch (err) {
        console.error("UTMify error:", err.message);
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: err.message }) };
      }
    }

    // === MODO STATUS ===
    if (action === "status") {
      const orderId = bodyData.order_id;
      if (!orderId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "order_id is required" }) };
      }

      const response = await fetch(`${FRUITFY_API_URL}/order/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${FRUITFY_API_TOKEN}`,
          "Store-Id": FRUITFY_STORE_ID,
          "Accept": "application/json",
        },
      });
      const data = await response.json();
      return { statusCode: response.status, headers, body: JSON.stringify(data) };
    }

    // === MODO CRIAR COBRANÇA PIX ===
    const response = await fetch(`${FRUITFY_API_URL}/pix/charge`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FRUITFY_API_TOKEN}`,
        "Store-Id": FRUITFY_STORE_ID,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    const data = await response.json();
    return { statusCode: response.ok ? 200 : response.status, headers, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || "Unknown error" }) };
  }
};
