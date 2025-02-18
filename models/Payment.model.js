const { Schema, model } = require("mongoose");

const paymentSchema = new Schema({
  name: String,
  cardNumber: String,
  expirationDate: Date,
  cvc: String,
  country: String,
  postalCode: String,
});

module.exports = model("Payment", paymentSchema);
