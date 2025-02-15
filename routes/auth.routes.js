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
      res.status(403).json({ message: "email already taken" });
    } else {
      const theSalt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, theSalt);

      const createdUser = await UserModel.create({
        ...req.body,
        password: hashedPassword,
      });
      res.status(200).json({ message: "signup successful", user: createdUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      res.status(403).json({ message: "Invalid credentials" });
    } else {
      foundUser.password = "****";

      const tokenCheck = process.env.TOKEN_SECRET;
      console.log("Token Secret:", tokenCheck);
      console.log(foundUser);
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
      console.log("here is the authToken", authToken);
      res
        .status(200)
        .json({ message: "login successful", authToken, user: foundUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  console.log("made it to the verify route", req.payload);
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
  cart.push(product);
  res.status(201).json(product);
});

router.delete("/favorites/:productId", isAuthenticated, (req, res) => {
  const productId = req.params.productId;
  cart = favorites.filter((product) => product.id !== productId);
  res.status(200).json({ message: "Product removed" });
});
module.exports = router;
