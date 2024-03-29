import express from "express";
import users from "./routes/toUsers.js";
import uploads from "./routes/toUploads.js";
import posts from "./routes/toPosts.js";
import comments from "./routes/toComments.js";
import general from "./routes/toGeneral.js";

const app = express();
const port = 8080;

app.set("view engine", "ejs");

app.use(users);
app.use(posts);
app.use(comments); 
app.use(uploads);
app.use(general);

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});