import express from "express";
import users from "./routes/users.js";
import register from "./routes/register.js";

const app = express();
const port = 8080;

app.set("view engine", "ejs");

//routes for existing users
app.use("/", users);
app.use("/:id", users);
app.use("/:id/edit", users);
app.use("/login", users);

//register user
app.use("/", register);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});