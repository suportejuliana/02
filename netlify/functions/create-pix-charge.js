const FRUITFY_API_URL = "https://api.fruitfy.io/api";
const FRUITFY_API_TOKEN = process.env.FRUITFY_API_TOKEN;
const FRUITFY_STORE_ID = process.env.FRUITFY_STORE_ID;

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
