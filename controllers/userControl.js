import passport from "passport";
import fs from 'fs';
import path from 'path';
import { getUsers, getUser, updateUser, createUser } from "../modules/user.js";
import { getPosts, getPostsByUserId, checkLikes } from "../modules/posts.js";
import { strategy } from "../modules/passport.js";
import { genPassword } from "./passwordUtils.js"
import { getComments } from "../modules/comments.js";


let isLoggedIn = false;

export async function getUserProfile(userId) {
  try {
    const users = await getUsers();
    if (!users) {
      throw new Error("Unable to fetch users");
    }

    const id = +userId;
    const user = await getUser(id);
    if (!user) {
      throw new Error("User not found");
    }

    const posts = await getPostsByUserId(id);
    const comments = await getComments();

    return { user, posts, users, comments };
  } catch (error) {
    throw new Error(`Error fetching user profile: ${error.message}`);
  }
}
export async function getUserProfileController(req, res, userId, currentUser_id){
  try {
    const { user, posts, users, comments } = await getUserProfile(userId);
    const postsWithLikes = await checkLikes(currentUser_id);
    res.render("./layouts/profileUser.ejs", {
      user,
      currentUser_id,
      page: "user-profile",
      partial: "posts-all",
      posts,
      users,
      comments,
      postsWithLikes,
      isLoggedIn: true, 
    });
  } catch (error) {
    res.status(500).render("./layouts/404.ejs", { error: error.message });
  }
}




export async function loginUser(req, res, next) {
  try {
    const posts = await getPosts();
    const users = await getUsers();
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
          isLoggedIn 
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        isLoggedIn = true;
        return res.redirect(`/users/`);
      });
    })(req, res, next);
  } catch (error) {
    next(error);
  }
}

export async function editUser(req, res, next) {
  try {
    let profile_pic;
    const id = req.params.id;
    const user = await getUser(id);
    const user_name = req.body.user_name;
    const email = req.body.email;
    const user_fullName = req.body.user_fullName;
    const user_age = req.body.user_age;
    const pronouns = req.body.pronouns;
    const user_bio = req.body.user_bio;
    if (req.file) {
      profile_pic = req.file.path
    } else {
      profile_pic = user.profile_pic;
    }
    const updatedUser = await updateUser(id, {
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
}

export async function createUserProfile(req, res, next){
    const user_name = req.body.user_name
    const email = req.body.email
    const password  = req.body.password
    const hash = await genPassword(password)
    let profile_pic = null;
    if (req.file) {
      profile_pic = req.file.path
    } 
    const newUser = await createUser({
        user_name,
        email,
        password: hash,
        profile_pic 
    });
    res.redirect(`/users/login`) 
}


export async function getUserFeed(res, currentUser_id){
try {
  const users = await getUsers();
  const comments = await getComments();
  const postsWithLikes = await checkLikes(currentUser_id);
  res.render("./layouts/profileUser.ejs", {
    currentUser_id,
    page: "feed",
    partial: "posts-feed",
    users,
    posts: postsWithLikes,
    comments,
    isLoggedIn: true, 
    user: null
  });
} catch (error) {
   console.log(error.message)
  res.status(500).render("./layouts/404.ejs", { error: error.message });
}}


