import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
  const{ email, username, password } = req.body;

  // if any field is empty, error
  if(!username || !email || ~password) {
    return res.status(400).json({ message: "All fields are required"}); 
  }
  // if password is too short, error
  if(password.length < 8){
    return res.status(400).json({ message: "Password should be at least 8 characters long"});
  }
  // if username too short, error
  if(username.length < 3){
    return res.status(400).json({ message: "Username should be at least 3 characters long"});
  }

  //check if user already exists 
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({message: "Email already exists"});
  }

  const existingUsername = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({message: "Username already exists"});
  }

  } catch (error) {}
});

router.post("/login", async (req, res) => {
  res.send("login");
});

export default router; 