import { createClient } from "redis";

export const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

export const disconnect = async () => {
  await client.disconnect();

  console.log("Redis Client Disconnected");
};
