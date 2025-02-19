const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/auth.middleware");
const cloudinary = require("cloudinary").v2;
const uploader = require("../middleware/cloudinary.config");
const { hashedPassword } = require("./auth.routes");

router.post(
  "/multiple-uploads",
  uploader.array("imageUrl"),
  async (req, res) => {
    const images = req.files;
    const imageUrls = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });

      imageUrls.push(result.secure_url);
    }
    console.log(req.files, imageUrls, req.body);
    if (!imageUrls.length) {
      console.log("there is no file");
      res.status(403).json({ message: "there is no file" });
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.body.userId,
        { profileImage: imageUrls[0] },
        { new: true }
      );
      res.status(200).json({ message: "success!", user: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating profile image" });
    }
  }
);

router.post("/signup", uploader.array("imageUrl"), async (req, res) => {
  const images = req.files;
  const imageUrls = [];
  if (images) {
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });
      imageUrls.push(result.secure_url);
    }
  }
  if (!imageUrls.length) {
    console.log("there is no file");
    try {
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
      const hashedUser = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        admin: req.body.admin,
      };
      const createdUser = await User.create(hashedUser);
      console.log("user created", createdUser);
      res.status(201).json({
        message: "user created without an image, nice work",
        createdUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating user" });
    }
  } else {
    console.log("there is a file image array", imageUrls);
    try {
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
      const hashedUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        profileImage: imageUrls[0],
      };
      const createdUser = await UserModel.create(hashedUser);
      console.log("user created", createdUser);
      res.status(201).json({
        message: "user createdb with an image, nice work",
        createdUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating user" });
    }
  }
});
router.post("/users", (req, res) => {
  console.log("Received request body:", req.body);
  User.create({
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
    admin: req.body.admin,
    profileImage: req.body.profileImage,
  })
    .then((user) => {
      console.log("User created:", user);
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to create the user" });
    });
});

router.get("/users", (req, res, next) => {
  User.find({})
    .then((user) => {
      console.log("Found users:", user);
      res.status(200).json(student);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});
router.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    console.log("Found user", user);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/users/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findByIdAndUpdate(userId, req.body, { new: true })
    .then((user) => {
      console.log("Updated user: ", user);
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to update the user" });
      next(err);
    });
});

module.exports = router;
