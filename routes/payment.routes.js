const stripe = require("stripe")(
  "sk_test_51Qs8GxCB5CgnDcFy0t0OrPVPkAMoeFva9yav2Vx34t5rcAAaTOUIvjBAi0OxvRjz6NS4jpBasc7ujBRf9BOuR85b00zFzCdS2t"
); // Secret Key
const express = require("express");
const router = express.Router();

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body; // Ensure amount and currency are passed from frontend

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
