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

export const Follower = {
  followUser: async (follower_id, followee_id) => {
    const created_at = new Date();
    return await db
      .select("*")
      .from("followers")
      .insert({ follower_id, followee_id, created_at });
  },
  unfollowUser: async (follower_id, followee_id) => {
    return await db
      .select("*")
      .from("followers")
      .where({ follower_id, followee_id })
      .del();
  },
  hasFollowed: async (follower_id, followee_id) => {
    const existingFollower = await db
      .select("*")
      .from("followers")
      .where({ follower_id: follower_id, followee_id: followee_id })
      .first();
    return !!existingFollower;
  },
  getFollowersCount: async (followee_id) => {
    const followersCount = await db("followers")
      .where({ followee_id })
      .count("* as followers_count")
      .first();
    return followersCount ? followersCount.followers_count : 0;
  },

  getFollowingCount: async (follower_id) => {
    const followingCount = await db("followers")
      .where({ follower_id })
      .count("* as following_count")
      .first();
    return followingCount ? followingCount.following_count : 0;
  },

  deleteRowsByUserId: async (user_id) => {
    await db("followers")
      .where("follower_id", user_id)
      .orWhere("followee_id", user_id)
      .del();
  },
};
