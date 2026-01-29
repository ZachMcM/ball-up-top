import Logger from "node-json-logger";

// @ts-ignore
export const logger = new Logger({ level: process.env.LOGGER_LEVEL });
