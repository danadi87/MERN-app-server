const { Schema, model } = require("mongoose");

const paymentSchema = new Schema({
  name: String,
  cardNumber: String,
  expirationDate: String,
  cvc: String,
  country: String,
  postalCode: String,
});

module.exports = model("Payment", paymentSchema);
