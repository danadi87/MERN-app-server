const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");

router.post("/products", async (req, res) => {
  try {
    const { category, image, title, description, amount, brand } = req.body;

    if (!category || !title || !amount) {
      return res
        .status(400)
        .json({ error: "Category, title, and amount are required." });
    }

    const product = await Product.create({
      category,
      image,
      title,
      description,
      amount,
      brand,
    });
    console.log("Product created: ", product);
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product: ", err);
    res.status(500).json({ error: "Failed to create the product." });
  }
});

router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;

    const query = category ? { category } : {};
    const products = await Product.find(query);

    console.log("Found products: ", products);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products: ", err);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

router.get("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    console.log("Found product: ", product);
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product: ", err);
    res.status(500).json({ error: "Failed to load the product." });
  }
});

router.delete("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("Deleted product", productId);

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
