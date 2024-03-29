import express from "express";
import { UserControl } from "../controllers/userControl.js";
const general = express.Router();

general.use(express.json());
general.use(express.urlencoded({ extended: true }));

//BASE
general.get("/", UserControl.loadLanding);
//LOGOUT
general.get("/logoutUser", UserControl.logoutUser);
//GET REGISTER 
general.get("/register/new", async (req, res) => {
  res.render("./layouts/index.ejs", {
    page: "register",
    message: null,
  });
});

export default general;
