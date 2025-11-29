import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "./redis";

export const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.sendCommand(args),
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: parseInt(process.env.MAX_REQS_PER_WINDOW!),
  message: "Too many requests from this IP, please try again later",
  skip: (_) => {
    // Skip rate limiting if Redis is down
    return !redis.isReady;
  },
});
