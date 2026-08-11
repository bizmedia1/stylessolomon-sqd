export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {

    const {
  plan,
  email,
  firstName,
  lastName
} = req.body;

console.log(req.body);
console.log("Plan received:", plan);

let amount;

switch (plan) {

      case "Diamond E-sim":
        amount = 1050000;
        break;

      case "Royal E-sim":
        amount = 1750000;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid plan selected"
        });

    }

    const response = await fetch(
      "https://api-d.squadco.com/transaction/initiate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  amount,
  email,
  currency: "NGN",
  initiate_type: "inline",
  customer_name: `${firstName} ${lastName}`,
  callback_url: "https://t.me/m/7eczK5fqOWM0"
})
      }
    );

    const data = await response.json();

if (!response.ok || !data.success) {
  return res.status(response.status).json({
    success: false,
    message: data.message || "Unable to initiate payment"
  });
}

return res.status(200).json({
  success: true,
  checkout_url: data.data.checkout_url,
  transaction_ref: data.data.transaction_ref
});
  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

}
