const express = require("express");
const morgan = require("morgan");
const PORT = 5005;
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");

const FRONTEND_URL = process.env.ORIGIN || `http://localhost:5173`;
const dbUrl = process.env.MONGO_URL;
const app = express();

const mongoose = require("mongoose");
mongoose
  .connect(dbUrl)
  .then((x) =>
    console.log(`Connected to Mongo! Database name:"${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to Mongo", err));

//Middleware
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// Product Routes
const productRoutes = require("./routes/product.routes");
app.use("/api", productRoutes);

//Payment routes
const paymentRoutes = require("./routes/payment.routes");
app.use("/payment", paymentRoutes);

//Custom error handler
app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
