const express = require("express");
const morgan = require("morgan");
const PORT = 5005;
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const { isAuthenticated } = require("./middleware/auth.middleware");

const FRONTEND_URL = process.env.ORIGIN || `http://localhost:5173`;

const app = express();

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/mern-app")
  .then((x) =>
    console.log(`Connected to Mongo! Database name:"${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to Mongo", err));

//Middleware
app.use(
  cors({
    origin: [FRONTEND_URL],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes

//user routes
const userRoutes = require("./routes/user.routes");
app.use("/api", isAuthenticated, userRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
