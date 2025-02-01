const router = require("express").Router();
const Product = require("../models/Product.model");

router.post("/api/products", (req, res, next) => {
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
      console.log(err);
      res.status(500).json({ error: "Failed to create the product." });
    });
});

router.get("/api/products", (req, res, next) => {
  Product.find({})
    .then((product) => {
      console.log("Found products: ", product);
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/api/products/:productId", (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      console.log("Found product: ", product);
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to load the product." });
      next(err);
    });
});

router.put("/api/products/:productId", (req, res, next) => {
  const productId = req.params.productId;
  Product.findByIdAndUpdate(productId, req.body, { new: true })
    .then((product) => {
      console.log("Updated product: ", product);
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to update the product." });
      next(err);
    });
});

router.delete("/api/products/:productId", (req, res, next) => {
  const productId = req.params.productId;
  Product.findByIdAndDelete(productId)
    .then((product) => {
      console.log("Product deleted");
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to delete the product" });
      next(err);
    });
});

module.exports = router;
