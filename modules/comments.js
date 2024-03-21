import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});

export const Comment = {
  getCommentsByPostId: async (post_id) => {
    return await db.select('*').from('comments').where('post_id', post_id);
  },

  deleteCommentsByPostId: async (post_id) => {
    return await db.select('*').from('comments').where('post_id', post_id).del();
  },

  getComments: async () => {
    return await db.select('*').from('comments');
  },

  getComment: async (comm_id) => {
    return await db.select().from('comments').where('comm_id', comm_id).first();
  },

  deleteComment: async (comm_id) => {
    const result = await db('comments').where('comm_id', comm_id).del();
    return result > 0;
  },

  createComment: async (fieldsToUpdate) => {
    fieldsToUpdate.comm_created = new Date();
    const [comm_id] = await db('comments').insert(fieldsToUpdate);
    return Comment.getComment(comm_id);
  },

  updateComment: async (comm_id, fieldsToUpdate) => {
    const result = await db('comments').where('comm_id', comm_id).update(fieldsToUpdate);
    return result > 0;
  },
};

export const getCommentsByPostId = Comment.getCommentsByPostId;
export const deleteCommentsByPostId = Comment.deleteCommentsByPostId;
export const getComment = Comment.getComment;
export const getComments = Comment.getComments;
export const deleteComment = Comment.deleteComment;
export const createComment = Comment.createComment;
export const updateComment = Comment.updateComment;
