import express from "express";
import multer from "multer";
import { PostControl } from "../controllers/postControl.js";
import { UserControl } from "../controllers/userControl.js";

const uploads = express.Router();
const storageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/profile_pics");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const newFilename = `${
      file.originalname.split(".")[0]
    }_${randomNumber}.${fileExtension}`;
    cb(null, newFilename);
  },
});
const uploadProfile = multer({ storage: storageProfile });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const newFilename = `${
      file.originalname.split(".")[0]
    }_${randomNumber}.${fileExtension}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

//UPDATE USER POST
uploads.post(
  "/users/:id/edit",
  uploadProfile.single("profile_pic"),
  UserControl.editUser
);
//UPLOAD A NEW POST
uploads.post(
  "/posts/create",
  upload.single("path"),
  PostControl.createPostController
);
//CREATE USER
uploads.post(
  "/register",
  upload.single("profile_pic"),
  UserControl.createUserProfile
);

export default uploads;
