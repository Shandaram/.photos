import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});

export const Post = {
  getPosts: async () => {
    return await db.select("*").from("posts");
  },

  getPost: async (post_id) => {
    return await db.select("*").from("posts").where("post_id", post_id).first();
  },

  getPostLikes: async (post_id, currentUser_id) => {
    const postWithLikes = await db
      .select(
        "posts.*",
        db.raw("COUNT(likes.user_id) > 0 AS liked_by_current_user")
      )
      .from("posts")
      .leftJoin("likes", function () {
        this.on("posts.post_id", "=", "likes.post_id").andOn(
          "likes.user_id",
          "=",
          db.raw("?", [currentUser_id])
        );
      })
      .where("posts.post_id", post_id)
      .groupBy("posts.post_id")
      .first();
    return postWithLikes;
  },

  getPostsByUserId: async (user_id, currentUser_id) => {
    const postsWithLikes = await db
      .select(
        "posts.*",
        db.raw("COUNT(likes.user_id) > 0 AS liked_by_current_user")
      )
      .from("posts")
      .leftJoin("likes", function () {
        this.on("posts.post_id", "=", "likes.post_id").andOn(
          "likes.user_id",
          "=",
          db.raw("?", [currentUser_id])
        );
      })
      .where("posts.user_id", user_id)
      .groupBy("posts.post_id");
    return postsWithLikes;
  },

  deletePost: async (post_id) => {
    const result = await db("posts").where("post_id", "=", post_id).del();
    return result > 0;
  },

  deletePostsByUserId: async (user_id) => {
    const result = await db("posts").where("user_id", "=", user_id).del();
    return result > 0;
  },

  createPost: async (fieldsToUpdate) => {
    fieldsToUpdate.post_created = new Date();
    const result = await db("posts").insert(fieldsToUpdate);
    const post_id = result[0];
    return Post.getPost(post_id);
  },

  updatePost: async (post_id, fieldsToUpdate) => {
    const result = await db("posts")
      .where("post_id", post_id)
      .update(fieldsToUpdate);
    return result > 0;
  },

  checkLikes: async (currentUser_id) => {
    const postsWithLikes = await db
      .select(
        "posts.*",
        db.raw("COUNT(likes.user_id) > 0 AS liked_by_current_user")
      )
      .from("posts")
      .leftJoin("likes", function () {
        this.on("posts.post_id", "=", "likes.post_id").andOn(
          "likes.user_id",
          "=",
          db.raw("?", [currentUser_id])
        );
      })
      .groupBy("posts.post_id");
    return postsWithLikes;
  },
};
