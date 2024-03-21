import { findById } from "../modules/user.js";
import { getPosts, getPostsByUserId } from "../modules/posts.js";
import { deleteComment, createComment } from "../modules/comments.js";

export async function createCommentInstance(req, res, next) {
    try{
  const comment = req.body.comment;
  const user_id = req.session.passport.user;
  const comm_created = new Date();
  const post_id = req.body.post_id;
  const user_name = await findById(user_id);
  const newComment = await createComment({
    comment,
    user_id,
    comm_created,
    post_id,
    user_name
  });
  res.redirect('back');
} catch (error) {
  console.error("Error creating comment:", error);
  res.status(500).json({ success: false, message: "Error creating comment" });
}
}

export const deleteCommentController = async (req, res) => {
  const comm_id = req.body.comm_id;
  await deleteComment(comm_id);
  res.redirect('back');
};


