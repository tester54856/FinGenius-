import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { getEnv } from "../utils/get-env";
import User from "../models/user.model";
import { AppError } from "../utils/app-error";

const jwtSecret = getEnv("JWT_SECRET");
const jwtRefreshSecret = getEnv("JWT_REFRESH_SECRET");

if (!jwtSecret || !jwtRefreshSecret) {
  throw new Error("JWT secrets are not configured");
}

// JWT Strategy for access tokens
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  },
  async (payload: any, done: any) => {
    try {
      const user = await User.findById(payload.id).select("-password");
      
      if (!user) {
        return done(null, false);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

// JWT Strategy for refresh tokens
const jwtRefreshStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtRefreshSecret,
  },
  async (payload: any, done: any) => {
    try {
      const user = await User.findById(payload.id).select("-password");
      
      if (!user) {
        return done(null, false);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

// Configure passport
passport.use("jwt", jwtStrategy);
passport.use("jwt-refresh", jwtRefreshStrategy);

export default passport;
