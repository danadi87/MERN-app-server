const ProductModel = require("./models/Product.model");
const products = require("./products.json");

const dbUrl = "mongodb+srv://Joshua:pizza1234@fourthtime.4gdi2.mongodb.net/";
const mongoose = require("mongoose");
mongoose
  .connect(dbUrl)
  .then((x) => {
    console.log(`Connected to Mongo! Database name:"${x.connections[0].name}"`);
    return ProductModel.insertMany(products);
  })
  .then((x) => {
    console.log("products good", x);
  })
  .catch((err) => console.error("Error connecting to Mongo", err));
