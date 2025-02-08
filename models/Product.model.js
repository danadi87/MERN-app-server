const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  category: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = model("Product", productSchema);
