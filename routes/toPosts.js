import express from 'express';
import { createPost, getPosts, getPost } from "../config/posts.js";
import multer from "multer";


const toPosts = express.Router();
toPosts.use(express.json());
toPosts.use(express.urlencoded({ extended: true }));
let page;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage})

// toPosts.get('/posts', async (req, res) => {
//   page = "post-create"
//   const posts = await getPosts();
//   res.render("./layouts/profileUser.ejs", {
//     page: page, 
//     posts
//   });
// });

toPosts.post('/', upload.single("path"), async (req, res) => {
  try {
    const user_id = req.session.passport.user;
    const description  = req.body.description;
    console.log(description)
    const path = req.file.path;
    await createPost({ description, user_id, path });
    res.redirect(`/users/${user_id}`); // Redirect to home page or any other appropriate page
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
});

toPosts.get("/posts/:id", async (req, res) => {
  const posts = await getPosts();
  if (!posts) {
    posts = await getPosts();
  } else {
    const post_id = +req.params.id;
    const post = await getPost(post_id);
    console.log(post)
    res.render("./partials/post-modal.ejs", {
      post,
      posts
    });
  }
});

export default toPosts;
