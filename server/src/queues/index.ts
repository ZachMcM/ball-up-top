import IORedis from "ioredis";

export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST!,
  port: parseInt(process.env.REDIS_PORT!),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PW,
  maxRetriesPerRequest: null,
});
