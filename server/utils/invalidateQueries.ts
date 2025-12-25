import { io } from "../src";
import { logger } from "./logger";

export function invalidateQueries(...keys: (string | number)[][]) {
  for (const key of keys) {
    logger.debug(`Invalidating queryKey ${JSON.stringify(key)}`)
    io.of("/invalidation").emit("data-invalidated", key);
  }
}