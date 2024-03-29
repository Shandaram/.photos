import { User } from "../models/users.js";
import { Comment } from "../models/comments.js";

export const CommentControl = {
  createCommentInstance: async (req, res, next) => {
    try {
      const comment = req.body.comment;
      const post_id = req.body.post_id;
      const user_id = req.body.user_id;
      const currentUser_id = req.session.passport.user;
      const comm_created = new Date();
      const user = await User.getUser(user_id);
      const user_name = user.user_name;
      const newComment = await Comment.createComment({
        comment,
        user_id,
        post_id,
        user_name,
        comm_created,
      });
      const newCommentText = newComment.comment;
      const updatedComments = await Comment.getCommentsByPostId(post_id);
      for (let i = 0; i < updatedComments.length; i++) {
        const newUser = await User.findById(updatedComments[i].user_id);
        updatedComments[i].user_name = newUser;
      }
      res.send({
        success: true,
        comments_count: updatedComments.length,
        comment: newCommentText,
        commentsNew: updatedComments,
        currentUser_id: currentUser_id,
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error creating comment" });
    }
  },

  deleteCommentController: async (req, res) => {
    try {
      const { comm_id } = req.body;
      const comment = await Comment.getComment(comm_id);
      const currentUser_id = req.session.passport.user;
      await Comment.deleteComment(comm_id);
      const updatedComments = await Comment.getCommentsByPostId(
        comment.post_id
      );
      for (let i = 0; i < updatedComments.length; i++) {
        const newUser = await User.findById(updatedComments[i].user_id);
        updatedComments[i].user_name = newUser;
      }
      res.send({
        success: true,
        comments_count: updatedComments.length,
        currentUser_id: currentUser_id,
        commentsNew: updatedComments,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res
        .status(500)
        .json({ success: false, message: "Error deleting comment" });
    }
  },
};
