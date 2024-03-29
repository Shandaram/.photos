import express from "express";
import session from "express-session";
import passport from "passport";
import Sequelize from "sequelize";
import connectSessionSequelize from "connect-session-sequelize";
import dotenv from "dotenv";
import { UserControl } from "../controllers/userControl.js";

dotenv.config();

const users = express.Router();

const SequelizeStore = connectSessionSequelize(session.Store);
const sequelize = new Sequelize(
  "photo_app",
  "root",
  process.env.MYSQL_PASSWORD,
  {
    dialect: "mysql",
    storage: "../db/sessions.sql",
  }
);

let myStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

users.use(express.json());
users.use(express.urlencoded({ extended: true }));
users.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: myStore,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
myStore.sync();

users.use(passport.initialize());
users.use(passport.session());

//GET LOGIN
users.get("/users/login", UserControl.renderLogin);
//LOGIN
users.post("/users/login", UserControl.loginUser);
//GET USER
users.get("/users/:id", UserControl.getUserProfileController);
//FEED ALL USERS
users.get("/users", UserControl.getUserFeed);
//CHECK UNIQUE EDIT USER_NAME and EMAIL
users.post("/users/check", UserControl.checkUnique);
// //CHECK PASSWORD, USER_NAME and EMAIL
users.post("/users/checkregister", UserControl.checkRegister);
//GET EDIT USER
users.get("/users/:id/edit", UserControl.getUserEdit);
//FOLLOW USER
users.post("/users/follow", UserControl.followUserController);
//DELETE  USER
users.get("/users/:id/delete", UserControl.deleteUser);

export default users;
