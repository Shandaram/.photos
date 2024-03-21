import { createPost, getPost, getPostsByUserId, deletePost } from '../modules/posts.js';
import { getUsers, getUser, updateUser } from '../modules/user.js';
import { deleteCommentsByPostId } from '../modules/comments.js';
import { likePost, unlikePost, hasUserLikedPost } from '../modules/likes.js';
import fs from 'fs';

export const createPostController = async (req, res) => {
  try {
    const user_id = req.session.passport.user;
    const description = req.body.description;
    const alt_text = req.body.alt_text;
    const path = req.file.path;
    await createPost({ description, user_id, path, alt_text });
    res.redirect(`/users/${user_id}`);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
};

export const getCreatePostPageController = async (req, res) => {
  const user_id = req.session.passport.user;
  const user = await getUser(user_id);
  const posts = await getPostsByUserId(user_id);
  const users = await getUsers();
  res.render("./layouts/profileUser.ejs", {
    page: "user-profile",
    partial: "post-create",
    user,
    posts,
    users,
    currentUser_id: user_id,
  });
};

export const deletePostController = async (req, res) => {
  const user_id = req.session.passport.user;
  const post_id = req.body.post_id;
  const post = await getPost(post_id);
  const path = post.path;
  fs.unlink(path, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } 
  });
  await deleteCommentsByPostId(post_id);
  await deletePost(post_id);
  return res.redirect(`/users/${user_id}`);
};

export const likePostController = async (req, res) => {
  const { post_id, user_id } = req.body;
  const userHasLikedPost = await hasUserLikedPost(post_id, user_id);
  if (userHasLikedPost) {
     await unlikePost(post_id, user_id);
     return  res.send({ success: true, like_count: post_id.likes });
  } else {
    await likePost(post_id, user_id);
    return  res.send({ success: true, like_count: post_id.likes });
  }
};
