import express from "express";
import multer from "multer";
import { createPostController, getCreatePostPageController, deletePostController, likePostController } from "../controllers/postControl.js";

const posts = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const newFilename = `${file.originalname.split('.')[0]}_${randomNumber}.${fileExtension}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

posts.use(express.json());
posts.use(express.urlencoded({ extended: true }));

posts.post("/posts", upload.single("path"), createPostController);
posts.get("/posts/create", getCreatePostPageController);
posts.post("/posts/delete", deletePostController);
posts.post("/posts/like", likePostController);

export default posts;

 