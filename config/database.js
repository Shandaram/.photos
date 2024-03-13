import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

export const User = {
  getUsers: async () => {
    const [results] = await pool.query("SELECT * FROM users");
    return results;
  },

  getUser: async (user_id) => {
    const [result] = await pool.query("SELECT * FROM users WHERE user_id = ?", [user_id]);
    return result[0];
  },

  findOne: async (query) => {
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [query]);
    return result[0];
  },

  deleteUser: async (user_id) => {
    const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [user_id]);
    return result.affectedRows > 0;
  },

  createUser: async (fieldsToUpdate) => {
    const fieldNames = Object.keys(fieldsToUpdate);
    const fieldValues = Object.values(fieldsToUpdate);
    const fieldUpdates = fieldNames.map((fieldName) => `${fieldName} = ?`).join(", ");

    const query = `INSERT INTO users SET ${fieldUpdates}`;

    const [result] = await pool.query(query, fieldValues);

    const user_id = result.insertId;
    return User.getUser(user_id);
  },

  updateUser: async (user_id, fieldsToUpdate) => {
    const fieldNames = Object.keys(fieldsToUpdate);
    const fieldValues = Object.values(fieldsToUpdate);

    const fieldUpdates = fieldNames.map((fieldName) => `${fieldName} = ?`).join(", ");

    const query = `UPDATE users SET ${fieldUpdates} WHERE user_id = ?`;

    const [result] = await pool.query(query, [...fieldValues, user_id]);
    return result.affectedRows > 0;
  },
};

export const getUsers = User.getUsers;
export const getUser = User.getUser;
export const findOne = User.findOne;
export const deleteUser = User.deleteUser;
export const createUser = User.createUser;
export const updateUser = User.updateUser;



export const Post = {
  getPosts: async () => {
    const [results] = await pool.query("SELECT * FROM posts");
    return results;
  },

  getPost: async (post_id) => {
    const [result] = await pool.query("SELECT * FROM posts WHERE post_id = ?", [post_id]);
    return result[0];
  },

  deletePost: async (user_id) => {
    const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [user_id]);
    return result.affectedRows > 0;
  },

  createPost: async (fieldsToUpdate) => {
    const fieldNames = Object.keys(fieldsToUpdate);
    const fieldValues = Object.values(fieldsToUpdate);
    const fieldUpdates = fieldNames.map((fieldName) => `${fieldName} = ?`).join(", ");

    const query = `INSERT INTO users SET ${fieldUpdates}`;

    const [result] = await pool.query(query, fieldValues);

    const user_id = result.insertId;
    return User.getUser(user_id);
  },

  updatePost: async (user_id, fieldsToUpdate) => {
    const fieldNames = Object.keys(fieldsToUpdate);
    const fieldValues = Object.values(fieldsToUpdate);

    const fieldUpdates = fieldNames.map((fieldName) => `${fieldName} = ?`).join(", ");

    const query = `UPDATE users SET ${fieldUpdates} WHERE user_id = ?`;

    const [result] = await pool.query(query, [...fieldValues, user_id]);
    return result.affectedRows > 0;
  },
};

export const getPosts = Post.getPosts;
export const getPost = Post.getPost;
// export const deleteUser = User.deleteUser;
// export const createUser = User.createUser;
// export const updateUser = User.updateUser;