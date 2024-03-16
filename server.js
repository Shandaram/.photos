import express from "express";
import users from "./routes/users.js";
import register from "./routes/register.js";
import toPosts from "./routes/toPosts.js";
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = 8080;

app.set("view engine", "ejs");

//routes for existing users
app.use(users);
app.use("/:id", users);
app.use("/:id/edit", users);
app.use("/login", users);

//register user
app.use("/", register);

//posts
app.use(toPosts); 
// app.use("/new", toPosts); 
app.use("/:id", toPosts);

//static
app.use('/', express.static('public'));

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});