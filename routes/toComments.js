import express from "express";
import passport from "passport";
import { CommentControl } from "../controllers/commentControl.js";

const comments = express.Router();

comments.use(express.json());
comments.use(express.urlencoded({ extended: true }));
comments.use(passport.initialize());
comments.use(passport.session());

//CREATE COMMENT
comments.post("/comments/create", CommentControl.createCommentInstance);
//DELETE COMMENT
comments.post("/comments/delete", CommentControl.deleteCommentController);

export default comments;
