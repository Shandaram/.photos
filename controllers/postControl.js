import { User } from "../models/users.js";
import { Post } from "../models/posts.js";
import { Comment } from "../models/comments.js";
import { Follower } from "../models/following.js";
import { Like } from "../models/likes.js";
import fs from "fs";

export const PostControl = {
  createPostController: async (req, res) => {
    try {
      const user_id = req.session.passport.user;
      const description = req.body.description;
      const alt_text = req.body.alt_text;
      const path = req.file.path;
      await Post.createPost({ description, user_id, path, alt_text });
      res.redirect(`/users/${user_id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).send("Error creating post");
    }
  },

  getCreatePostPageController: async (req, res) => {
    const user_id = req.session.passport.user;
    const user = await User.getUser(user_id);
    const posts = await Post.getPostsByUserId(user_id, user_id);
    const users = await User.getUsers();
    const followers_count = await Follower.getFollowersCount(user_id);
    const following_count = await Follower.getFollowingCount(user_id);
    res.render("./layouts/profileUser.ejs", {
      page: "user-profile",
      partial: "post-create",
      user,
      posts,
      users,
      followers_count,
      following_count,
      currentUser_id: user_id,
    });
  },

  deletePostController: async (req, res) => {
    const user_id = req.session.passport.user;
    const post_id = req.body.post_id;
    const post = await Post.getPost(post_id);
    const path = post.path;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      }
    });
    await Comment.deleteCommentsByPostId(post_id);
    await Like.deleteLikesByPostId(post_id);
    await Post.deletePost(post_id);
    return res.redirect(`/users/${user_id}`);
  },

  likePostController: async (req, res) => {
    const { post_id, user_id } = req.body;
    const userHasLikedPost = await Like.hasUserLikedPost(post_id, user_id);
    const currentUser_id = req.session.passport.user;
    if (userHasLikedPost) {
      await Like.unlikePost(post_id, user_id);
    } else {
      await Like.likePost(post_id, user_id);
    }
    const updatedPost = await Post.getPostLikes(post_id, currentUser_id);
    return res.send({
      success: true,
      like_count: updatedPost.likes,
      liked: updatedPost.liked_by_current_user,
    });
  },

  editPost: async (req, res, next) => {
    try {
      const post_id = req.params.id;
      const { description, alt_text } = req.body;
      const post = await Post.getPost(post_id);
      const updatedPost = await Post.updatePost(post_id, {
        description,
        alt_text,
      });
      res.redirect(`/users/${post.user_id}`);
    } catch (error) {
      next(error);
    }
  },
};
