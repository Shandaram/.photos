import express from "express";
import users from "./routes/toUsers.js";
import register from "./routes/register.js";
import posts from "./routes/toPosts.js";
import comments from "./routes/toComments.js"
import { getUsers } from "./modules/user.js";
import { getPosts } from "./modules/posts.js";
import {getComments } from "./modules/comments.js"

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
app.use(posts); 
app.use("/create", posts); 
app.use("/:id", posts);
app.use("/like", posts);

//comments
app.use(comments); 
app.use("/create", comments); 
app.use("/delete", comments);

//static
app.use('/', express.static('public'));

//base
app.get("/", async (req, res) => {
  const posts = await getPosts()
  const users = await getUsers()
  const comments = await getComments()
  res.render("./layouts/index.ejs", {
    page: "landing",
    posts, 
    users,
    comments,
    isLoggedIn: false,
    currentUser_id: null,
    user: null
  });
});

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});