const { Schema, model } = require("mongoose");

const paymentSchema = new Schema({
  name: String,
  cardNumber: Number,
  expirationDate: Date,
  cvc: Number,
  country: String,
  postalCode: String,
});

module.exports = model("Payment", paymentSchema);
