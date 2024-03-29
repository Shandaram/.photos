import passport from "passport";
import LocalStrategy from "passport-local";
import { validPassword } from "../controllers/passwordUtils.js";
import { User } from "./users.js";

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
  try {
    const user = await User.getBy(username, "email");
    if (!user) {
      return done(null, false, { message: "No user with this email" });
    }
    const isValid = await validPassword(password, user.password);
    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Wrong password" });
    }
  } catch (err) {
    done(err);
  }
};

export const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use("local", strategy);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((user, done) => {
  User.getUser(user)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
