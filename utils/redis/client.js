import { createClient } from "redis";
import { logger } from "../logger.js";

export const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => logger.error(err, "Redis Client Error"));

await client.connect();

export const disconnect = async () => {
  await client.disconnect();

  logger.info("Redis Client Disconnected");
};
