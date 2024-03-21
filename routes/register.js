import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { createUserProfile } from "../controllers/userControl.js";
dotenv.config();

const register = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/profile_pics");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const newFilename = `${file.originalname.split('.')[0]}_${randomNumber}.${fileExtension}`;
    cb(null, newFilename);
  },
});
const upload = multer({ storage: storage });

register.use(express.json());
register.use(express.urlencoded({ extended: true }));

register.get("/register/new", async (req, res) => {
  res.render("./layouts/index.ejs", {
    page: "register",
  });
});

register.post("/register", upload.single("profile_pic"), createUserProfile);

export default register;