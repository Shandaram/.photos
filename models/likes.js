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

export const Like = {
  likePost: async (post_id, user_id) => {
    return await db.select("*").from("likes").insert({ post_id, user_id });
  },

  unlikePost: async (post_id, user_id) => {
    return await db.select("*").from("likes").where({ post_id, user_id }).del();
  },
  hasUserLikedPost: async (post_id, user_id) => {
    const existingLike = await db
      .select("*")
      .from("likes")
      .where({ post_id: post_id, user_id: user_id })
      .first();
    return !!existingLike;
  },
  deleteLikesByPostId: async (post_id) => {
    return await db.select("*").from("likes").where("post_id", post_id).del();
  },

  deleteLikesByUserId: async (user_id) => {
    return await db.select("*").from("likes").where("user_id", user_id).del();
  },
};
