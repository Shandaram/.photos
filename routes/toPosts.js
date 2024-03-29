import express from "express";
import { PostControl } from "../controllers/postControl.js";

const posts = express.Router();
posts.use(express.json());
posts.use(express.urlencoded({ extended: true }));

//GET POST CREATE PAGE
posts.get("/posts/new", PostControl.getCreatePostPageController);
//DElETE POST
posts.post("/posts/delete", PostControl.deletePostController);
//LIKE POST
posts.post("/posts/like", PostControl.likePostController);
//EDIT POST
posts.post("/posts/:id/edit", PostControl.editPost);

export default posts;
