import express from "express";
import User from "../models/user.js";

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login User
router.post("/login", (req, res) => {
  // Placeholder for login logic
  res.send("Login endpoint");
});

export default router;
