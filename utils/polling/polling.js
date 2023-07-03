import Queue from "queue";
import { client } from "../redis/client.js";
import { getUser } from "../user/saveUser.js";
import { loginUser } from "../../core/index.js";
import { formatAndSendStoreData } from "../../bot/helpers/formatAndSendStoreData.js";
import { logger } from "../logger.js";

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
    const users = await getUser(tgId);

    if (!users) {
      continue;
    }

    for (const user of users) {
      q.push(async (cb) => {
        logger.info(
          `Adding task for user ${user.username} to the queue. Current queue length: ${q.length}.`
        );

        const { username, password } = user;

        const { access_token, entitlements_token, playerId } = await loginUser({
          username,
          password,
        });

        await formatAndSendStoreData(
          {
            playerId,
            access_token,
            entitlements_token,
            username,
          },
          bot,
          tgId
        );

        cb();

        logger.info(
          `Task for user ${user.username} completed. Remaining tasks in the queue: ${q.length}.`
        );
      });
    }
  }
};

// ...rest of your code remains unchanged...

export const registerPolling = async (tgId, playerId) => {
  const getPollingData = await client.get("POLLING");

  if (!getPollingData) {
    await client.set("POLLING", JSON.stringify([{ tgId, playerId }]));

    return;
  }

  const pollingData = JSON.parse(getPollingData);

  const isAlreadyRegistered = pollingData.some((data) => data.tgId === tgId);

  if (isAlreadyRegistered) {
    return;
  }

  await client.set(
    "POLLING",
    JSON.stringify([...pollingData, { tgId, playerId }])
  );
};
