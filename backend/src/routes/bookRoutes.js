import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";

const router = express.Router();

// create 
router.post("/", async (req, res) => {
  try {
      const { title, caption, rating, image } = req.body;

      if(!image || !title || !caption || !rating) {
        return res.status(400).json({ message: "Please provide all fields" });
      }

      // upload image to cloudinary
      const uploadReponse = await cloudinary.uploader.upload(image);
      const imageUrl = uploadReponse.secure_url
      // save to db

      const newBook = new Book
  } catch (error) {}
})

// delete 

// fetch all

export default router; 