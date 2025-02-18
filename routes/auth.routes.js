const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/auth.middleware");
const UserModel = require("../models/User.model");

let cart = [];
let favorites = [];

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await UserModel.findOne({ email });
    if (foundUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const theSalt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(password, theSalt);

    const createdUser = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Signup successful", user: createdUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    foundUser.password = "****";

    const authToken = jwt.sign(
      {
        _id: foundUser._id,
        name: foundUser.name,
        profileImage: foundUser.profileImage,
        admin: foundUser.admin,
      },
      process.env.TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "480h",
      }
    );

    res
      .status(200)
      .json({ message: "Login successful", authToken, user: foundUser });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

router.get("/cart", isAuthenticated, (req, res) => {
  res.json(cart);
});

router.post("/cart", isAuthenticated, (req, res) => {
  const product = req.body;
  cart.push(product);
  res.status(201).json(product);
});

router.delete("/cart/:productId", isAuthenticated, (req, res) => {
  const productId = req.params.productId;
  cart = cart.filter((product) => product.id !== productId);
  res.status(200).json({ message: "Product removed" });
});

router.get("/favorites", isAuthenticated, (req, res) => {
  res.json(favorites);
});

router.post("/favorites", isAuthenticated, (req, res) => {
  const product = req.body;
  favorites.push(product);
  res.status(201).json(product);
});

router.delete("/favorites/:productId", isAuthenticated, (req, res) => {
  const productId = req.params.productId;
  favorites = favorites.filter((product) => product.id !== productId);
  res.status(200).json({ message: "Product removed" });
});

module.exports = router;
