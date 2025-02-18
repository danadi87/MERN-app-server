const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment.model");

router.post("/add", async (req, res) => {
  try {
    const { name, cardNumber, expirationDate, cvc, country, postalCode } =
      req.body;
    const newPayment = new Payment({
      name,
      cardNumber,
      expirationDate,
      cvc,
      country,
      postalCode,
    });

    await newPayment.save();
    res
      .status(201)
      .json({ message: "Payment added successfully", payment: newPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding payment", error: error.message });
  }
});

module.exports = router;
