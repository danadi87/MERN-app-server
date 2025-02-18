const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Payment = require("../models/Payment.model");

router.post("/add", async (req, res) => {
  try {
    const { name, cardNumber, expirationDate, cvc, country, postalCode } =
      req.body;

    const salt = bcrypt.genSaltSync(12);

    const hashedCardNumber = bcrypt.hashSync(cardNumber, salt);
    const hashedCvc = bcrypt.hashSync(cvc, salt);

    const newPayment = new Payment({
      name,
      cardNumber: hashedCardNumber,
      expirationDate,
      cvc: hashedCvc,
      country,
      postalCode,
    });

    await newPayment.save();
    res
      .status(201)
      .json({ message: "Payment added successfully", payment: newPayment });
  } catch (error) {
    console.error("Error saving payment:", error);
    res
      .status(500)
      .json({ message: "Error adding payment", error: error.message });
  }
});

module.exports = router;
