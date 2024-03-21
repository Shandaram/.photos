import express from "express";
import session from "express-session";
import passport from "passport";
import multer from "multer";
import Sequelize from "sequelize";
import connectSessionSequelize from "connect-session-sequelize";
import dotenv from "dotenv";
import { getUser, getUsers } from "../modules/user.js";
import {
  getUserProfileController,
  loginUser,
  editUser,
  getUserFeed
} from "../controllers/userControl.js";

dotenv.config();

const users = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/profile_pics");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const newFilename = `${file.originalname.split('.')[0]}_${randomNumber}.${fileExtension}`;
    cb(null, newFilename);
  },
});
const upload = multer({ storage: storage });

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

let message = "";

//GET LOGIN
users.get("/users/login", async (req, res) => {
  res.render("./layouts/index.ejs", {
    page: "login",
    message: message,
  });
});

// GET USER
users.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const currentUser_id = req.session.passport.user;
  await getUserProfileController(req, res, userId, currentUser_id);
});

// FEED ALL USERS
users.get("/users", async (req, res) => {
  const currentUser_id = req.session.passport.user;
  await getUserFeed(res, currentUser_id);
});

// LOGIN
users.post("/users/login", loginUser);

//EDIT USER GET
users.get("/users/:id/edit", async (req, res) => {
  const currentUser_id = req.session.passport.user;
  const users = await getUsers();
  const user = await getUser(currentUser_id);
  res.render("./layouts/profileUser.ejs", {
    user,
    page: "user-edit",
    users,
    currentUser_id,
  });
});

//EDIT USER POST
users.post("/users/:id/edit", upload.single("profile_pic"), editUser);

export default users;
