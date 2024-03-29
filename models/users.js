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

export const User = {
  getUsers: async () => {
    return await db.select("*").from("users");
  },

  getUser: async (user_id) => {
    return await db.select("*").from("users").where("user_id", user_id).first();
  },

  getBy: async (query, row) => {
    return await db.select("*").from("users").where(row, query).first();
  },

  findById: async (user_id) => {
    const user = await db
      .select("user_name")
      .from("users")
      .where("user_id", user_id)
      .first();
    return user ? user.user_name : null;
  },

  deleteUser: async (user_id) => {
    const result = await db("users").where("user_id", user_id).del();
    return result > 0;
  },

  createUser: async (fieldsToUpdate) => {
    const result = await db("users").insert(fieldsToUpdate);
    const user_id = result[0];
    return User.getUser(user_id);
  },

  updateUser: async (user_id, fieldsToUpdate) => {
    const result = await db("users")
      .where("user_id", user_id)
      .update(fieldsToUpdate);
    return result > 0;
  },
};
