import Queue from "queue";
import { client } from "../redis/client.js";
import { getUsers } from "../user/saveUser.js";
import { logger } from "../logger.js";
import { sendUserStore } from "../../bot/helpers/sendUserStore.js";

const q = new Queue({ autostart: true, concurrency: 1 });

export const getPollingData = async () => {
  const getPollingData = await client.get("POLLING");

  if (!getPollingData) {
    return [];
  }

  return JSON.parse(getPollingData);
};

export const pollForStore = (bot) => async () => {
  logger.info("Polling for store data");
  const pollingData = await getPollingData();

  for (const { tgId, playerId } of pollingData) {
    const user = await getUsers(tgId, playerId);

    if (!user) {
      continue;
    }

    sendUserStore({ user, tokens: null }, bot, tgId);
  }
};

export const registerPolling = async (tgId, playerId) => {
  const getPollingData = await client.get("POLLING");

  if (!getPollingData) {
    await client.set("POLLING", JSON.stringify([{ tgId, playerId }]));

    return;
  }

  const pollingData = JSON.parse(getPollingData);

  const isAlreadyRegistered = pollingData.some(
    (data) => data.tgId === tgId && data.playerId === playerId
  );

  if (isAlreadyRegistered) {
    return;
  }

  await client.set(
    "POLLING",
    JSON.stringify([...pollingData, { tgId, playerId }])
  );
};
