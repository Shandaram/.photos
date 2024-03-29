import passport from "passport";
import validator from "validator";
import { User } from "../models/users.js";
import { Post } from "../models/posts.js";
import { Like } from "../models/likes.js";
import { Follower } from "../models/following.js";
import { Comment } from "../models/comments.js";
import { strategy } from "../models/passport.js";
import { genPassword } from "./passwordUtils.js";
import fs from "fs";

export const UserControl = {
  loadLanding: async (req, res) => {
    const isLoggedInV = req.session.isLoggedIn || false;
    if (isLoggedInV) {
      return res.redirect("/users");
    } else {
      const posts = await Post.getPosts();
      posts.sort((a, b) => new Date(b.post_created) - new Date(a.post_created));
      const users = await User.getUsers();
      const comments = await Comment.getComments();
      res.render("./layouts/index.ejs", {
        page: "landing",
        posts,
        users,
        comments,
        isLoggedIn: isLoggedInV,
        currentUser_id: null,
        user: null,
      });
    }
  },
  renderLogin: async (req, res) => {
    res.render("./layouts/index.ejs", {
      page: "login",
      message: "",
    });
  },

  getUserEdit: async (req, res) => {
    const currentUser_id = req.session.passport.user;
    const users = await User.getUsers();
    const user = await User.getUser(currentUser_id);
    res.render("./layouts/profileUser.ejs", {
      user,
      page: "user-edit",
      users,
      currentUser_id,
    });
  },
  getUserProfileController: async (req, res) => {
    try {
      const userId = req.params.id;
      const currentUser_id = req.session.passport.user;
      const id = +userId;
      const user = await User.getUser(id);
      const users = await User.getUsers();
      const comments = await Comment.getComments();
      const postsWithLikes = await Post.getPostsByUserId(
        user.user_id,
        currentUser_id
      );
      postsWithLikes.sort(
        (a, b) => new Date(b.post_created) - new Date(a.post_created)
      );
      const userHasFollowed = await Follower.hasFollowed(
        currentUser_id,
        userId
      );
      const followers_count = await Follower.getFollowersCount(userId);
      const following_count = await Follower.getFollowingCount(userId);
      res.render("./layouts/profileUser.ejs", {
        user,
        currentUser_id,
        page: "user-profile",
        partial: "posts-all",
        posts: postsWithLikes,
        users,
        comments,
        followers_count,
        following_count,
        isLoggedIn: req.session.isLoggedIn,
        userHasFollowed: userHasFollowed,
      });
    } catch (error) {
      res.status(500).render("./layouts/404.ejs", { error: error.message });
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const posts = await Post.getPosts();
      const users = await User.getUsers();
      passport.authenticate(strategy, (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          const message = info.message;
          return res.render("./layouts/index.ejs", {
            page: "login",
            message: message,
            posts: posts,
            users: users,
            isLoggedIn: false,
          });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          req.session.isLoggedIn = true;
          return res.redirect(`/users`);
        });
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  },
  editUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await User.getUser(id);
      const user_name = req.body.user_name;
      const email = req.body.email;
      const user_fullName = req.body.user_fullName;
      const user_age = req.body.user_age;
      const pronouns = req.body.pronouns;
      const user_bio = req.body.user_bio;
      let profile_pic = user.profile_pic;

      if (req.file) {
        profile_pic = req.file.path;
        fs.unlink(user.profile_pic, (err) => {
          if (err) {
            console.error(`Error deleting file: ${err}`);
          }
        });
      }
      const updatedUser = await User.updateUser(id, {
        user_name,
        email,
        user_fullName,
        user_age,
        user_bio,
        profile_pic,
        pronouns,
      });
      res.redirect(`/users/${user.user_id}`);
    } catch (error) {
      next(error);
    }
  },
  checkUnique: async (req, res) => {
    let value = req.body.formData;
    value = value.trim();
    const currentUser_id = req.session.passport.user;
    const user = await User.getUser(currentUser_id);
    const userName = user.user_name;
    const userEmail = user.email;
    let existingName, existingEmail;
    if (value != userName && value != userEmail) {
      existingName = await User.getBy(value, "user_name");
      existingEmail = await User.getBy(value, "email");
    }
    let message;
    if (existingEmail || existingName) {
      if (existingName) {
        message = "User name already taken! Please try another one.";
      } else if (existingEmail) {
        message = "Email already in use! Do you have another account?";
      }
      return res.send({
        success: true,
        message: message,
      });
    } else {
      return res.send({
        success: true,
        message: null,
      });
    }
  },
  checkRegister: async (req, res) => {
    let username = req.body.formData.username;
    let email = req.body.formData.email;
    let password = req.body.formData.password;
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    let message;
    if (username) {
      let existingName = await User.getBy(username, "user_name");
      if (existingName) {
        message = "User name already taken! Please try another one.";
      }
      return res.send({
        success: false,
        message: message,
      });
    }

    if (email) {
      let existingEmail = await User.getBy(email, "email");
      if (existingEmail) {
        message = "Email already in use! Do you have another account?";
      }
      if (!validator.isEmail(email)) {
        message = "Invalid email format";
      }
      return res.send({
        success: false,
        message: message,
      });
    }

    if (password) {
      const isPasswordSecure = regex.test(password);
      if (!isPasswordSecure) {
        message =
          "Password must be at least 8 characters long and contain at least one special character (!@#$%^&*), and at least one number";
        return res.send({
          success: false,
          message: message,
        });
      }
    }
    return res.send({
      success: true,
      message: null,
    });
  },

  createUserProfile: async (req, res, next) => {
    const user_name = req.body.user_name;
    const email = req.body.email;
    const password = req.body.password;
    const existingEmail = await User.getBy(email, "email");
    const existingName = await User.getBy(user_name, "user_name");
    let message;
    if (existingEmail || existingName) {
      if (existingName) {
        message = "User name already exists";
      } else if (existingEmail) {
        message = "Email already in use";
      }
      if (existingEmail && existingName) {
        message = "This profiile already exists";
      }
      return res.render("./layouts/index.ejs", {
        page: "register",
        message: message,
      });
    }
    const hash = await genPassword(password);
    let profile_pic = "public/uploads/profile_pics/default.jpeg";
    if (req.file) {
      profile_pic = req.file.path;
    }
    const newUser = await User.createUser({
      user_name,
      email,
      password: hash,
      profile_pic,
    });
    res.redirect(`/users/login`);
  },

  getUserFeed: async (req, res) => {
    try {
      const currentUser_id = req.session.passport.user;
      const users = await User.getUsers();
      const comments = await Comment.getComments();
      const postsWithLikes = await Post.checkLikes(currentUser_id);
      postsWithLikes.sort(
        (a, b) => new Date(b.post_created) - new Date(a.post_created)
      );

      res.render("./layouts/profileUser.ejs", {
        currentUser_id,
        page: "feed",
        partial: "posts-feed",
        users,
        posts: postsWithLikes,
        comments,
        isLoggedIn: req.session.isLoggedIn,
        user: null,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).render("./layouts/404.ejs", { error: error.message });
    }
  },

  followUserController: async (req, res) => {
    const { user_id } = req.body;
    const currentUser_id = req.session.passport.user;
    const userHasFollowed = await Follower.hasFollowed(currentUser_id, user_id);
    if (userHasFollowed) {
      await Follower.unfollowUser(currentUser_id, user_id);
    } else {
      await Follower.followUser(currentUser_id, user_id);
    }
    const followers_count = await Follower.getFollowersCount(user_id);
    const updatedFollow = await Follower.hasFollowed(currentUser_id, user_id);
    return res.send({
      success: true,
      userHasFollowed: updatedFollow,
      followers_count: followers_count,
    });
  },
  logoutUser: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.redirect("/");
    });
  },

  deleteUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await User.getUser(id);
      const posts = await Post.getPostsByUserId(id, id);
      if (user.profile_pic != "public/uploads/profile_pics/default.jpeg") {
        fs.unlink(user.profile_pic, (err) => {
          if (err) {
            console.error(`Error deleting file: ${err}`);
          }
        });
      }
      for (const post of posts) {
        fs.unlink(post.path, (err) => {
          if (err) {
            console.error(`Error deleting file: ${err}`);
          }
        });
        await Comment.deleteCommentsByPostId(post.post_id);
        await Like.deleteLikesByPostId(post.post_id);
      }
      await Like.deleteLikesByUserId(id);
      await Comment.deleteCommentsByUserId(id);
      await Post.deletePostsByUserId(id);
      await Follower.deleteRowsByUserId(id);
      req.session.destroy();
      await User.deleteUser(id);
      res.redirect(`/`);
    } catch (error) {
      next(error);
    }
  },
};
