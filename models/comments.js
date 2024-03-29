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

export const Comment = {
  getCommentsByPostId: async (post_id) => {
    return await db.select("*").from("comments").where("post_id", post_id);
  },

  deleteCommentsByPostId: async (post_id) => {
    return await db
      .select("*")
      .from("comments")
      .where("post_id", post_id)
      .del();
  },

  deleteCommentsByUserId: async (user_id) => {
    return await db
      .select("*")
      .from("comments")
      .where("user_id", user_id)
      .del();
  },

  getComments: async () => {
    const commentsWithUserName = await db("comments")
      .select("comments.*", "users.user_name")
      .leftJoin("users", "comments.user_id", "users.user_id");

    return commentsWithUserName;
  },

  getComment: async (comm_id) => {
    return await db.select().from("comments").where("comm_id", comm_id).first();
  },

  deleteComment: async (comm_id) => {
    const result = await db("comments").where("comm_id", comm_id).del();
    return result > 0;
  },

  createComment: async (fieldsToUpdate) => {
    fieldsToUpdate.comm_created = new Date();
    const [comm_id] = await db("comments").insert(fieldsToUpdate);
    return Comment.getComment(comm_id);
  },
};
