import express from "express";
import session from "express-session";
import { getUsers, getUser, updateUser } from "../config/user.js";
import { getPosts } from "../config/posts.js";
import multer from "multer";
import passport from "passport";
import  { strategy }  from '../config/passport.js';
import Sequelize from "sequelize";
import connectSessionSequelize from 'connect-session-sequelize';
import dotenv from "dotenv";
dotenv.config();

const users = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
users.use(express.json());
users.use(express.urlencoded({ extended: true }));

const SequelizeStore = connectSessionSequelize(session.Store);

const sequelize = new Sequelize("photo_app", "root", "root", {
  dialect: "mysql",
  storage: "../modules/sessions.sql",
});


var myStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000 
});

users.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: myStore,
    saveUninitialized: false,
    resave: false,
    cookie: {
    maxAge: 1000 * 60 * 60 * 24
    }
  })
);
myStore.sync();

users.use(passport.initialize())
users.use(passport.session())
let page = "login";
let message = "";

// GET USERS
users.get("/users", async (req, res) => {
  res.render("./layouts/index.ejs", {
    page: page,
    message: message
  });

});

// GET USER
users.get("/users/:id", async (req, res) => {
  const allUsers = await getUsers();
  if (!allUsers) {
    allUsers = await getUsers();
  } else {
    const id = +req.params.id;
    const user = await getUser(id);
    if (!user) {
      res.status(404).render("./layouts/404.ejs");
      return;
    }
    if(req.session.viewCount) {
      req.session.viewCount++
    } else {
      req.session.viewCount = 1;
    }
    const posts = await getPosts();
    res.render("./layouts/profileUser.ejs", {
      user,
      page: "user-profile",
      posts
    });
  }
});

// LOGIN
users.post("/users/login", async (req, res, next) => {
  passport.authenticate(strategy,(err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      message = info.message;
      res.render("./layouts/index.ejs", {
        page: page,
        message: message
      });
     
    }
    message = ""
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
     
      return res.redirect(`/users/${user.user_id}`);
    });
  })(req, res, next);
});

//EDIT USER GET
users.get("/users/:id/edit", async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id);
  res.render("./layouts/profileUser.ejs", {
    user,
    page: "user-edit",
  });
});

//EDIT USER POST
users.post(
  "/users/:id/edit",
  upload.single("profile_pic"),
  async (req, res) => {
    let profile_pic;
    const id = req.params.id;
    const user = await getUser(id);
    const user_fullName = req.body.user_fullName;
    const user_age = req.body.user_age;
    const pronouns = req.body.pronouns;
    const user_bio = req.body.user_bio;
    if (req.file) {
      profile_pic = req.file.buffer.toString("base64");
    } else {
      profile_pic = user.profile_pic;
    }
    const updatedUser = await updateUser(id, {
      user_fullName,
      user_age,
      user_bio,
      profile_pic,
      pronouns
    });
    res.redirect(`/users/${user.user_id}`);
  }
);

export default users;