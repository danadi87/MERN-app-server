const router = require("express").Router();
const Product = require("../models/Product.model");

router.post("/", (req, res, next) => {
  console.log("POST request received to create a product");
  Product.create({
    category: req.body.category,
    image: req.body.image,
    title: req.body.title,
    description: req.body.description,
    amount: req.body.amount,
  })
    .then((product) => {
      console.log("Product created: ", product);
      res.status(201).json(product);
    })
    .catch((err) => {
      console.error("Error creating product: ", err);
      res.status(500).json({ error: "Failed to create the product." });
    });
});

router.get("/", (req, res, next) => {
  console.log("GET request received for products");
  Product.find({})
    .then((product) => {
      console.log("Found products: ", product);
      res.status(200).json(product);
    })
    .catch((err) => {
      console.error("Error fetching products: ", err);
      next(err);
    });
});

router.get("/:productId", (req, res, next) => {
  console.log(
    `GET request received for product with ID: ${req.params.productId}`
  );
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      console.log("Found product: ", product);
      res.status(200).json(product);
    })
    .catch((err) => {
      console.error("Error fetching product: ", err);
      res.status(500).json({ error: "Failed to load the product." });
      next(err);
    });
});

module.exports = router;
