import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "15d"});
}

router.post("/register", async (req, res) => {
  try {
  const{ email, username, password } = req.body;

  // if any field is empty, error
  if(!username || !email || !password) {
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

  // if username has a space, error
  if(username.includes(" ")){
    return res.status(400).json({ message: "Username must not contain spaces"});
  }

  // basic email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
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

  //pull randon avitar
  const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;



  const user = new User({
    email,
    username,
    password,
    profileImage,
  })

  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user:{
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    },
  });
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" })
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "Invalid credentials" });

    // check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // generate token
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error"});
  }
});

export default router; 