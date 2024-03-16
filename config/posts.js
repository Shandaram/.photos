import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();



export const Post = {
    getPosts: async () => {
      const [results] = await pool.query("SELECT * FROM posts");
      return results;
    },
  
    getPost: async (post_id) => {
      const [result] = await pool.query("SELECT * FROM posts WHERE post_id = ?", [post_id]);
      return result[0];
    },
  
    deletePost: async (post_id) => {
      const [result] = await pool.query("DELETE FROM posts WHERE post_id = ?", [post_id]);
      return result.affectedRows > 0;
    },
  
    createPost: async (fieldsToUpdate) => {
      const fieldNames = Object.keys(fieldsToUpdate);
      const fieldValues = Object.values(fieldsToUpdate);
      fieldNames.push('post_created');
      fieldValues.push(new Date()); 
      const fieldUpdates = fieldNames.map((fieldName) => `${fieldName} = ?`).join(", ");


      const query = `INSERT INTO posts SET ${fieldUpdates}`;
  
      const [result] = await pool.query(query, fieldValues);
  
      const post_id = result.insertId;
      return Post.getPost(post_id);
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
  export const deletePost = Post.deletePost;
  export const createPost = Post.createPost;
  export const updatePost = Post.updatePost;