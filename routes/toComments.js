import express from "express" 
import passport from "passport";
import { createCommentInstance, deleteCommentController} from '../controllers/commentControl.js'

const comments = express.Router() 

comments.use(express.json()) 
comments.use(express.urlencoded({ extended: true })) 
comments.use(passport.initialize())
comments.use(passport.session())

comments.post("/comments/create", createCommentInstance);
comments.post("/comments/delete", deleteCommentController);

export default comments 