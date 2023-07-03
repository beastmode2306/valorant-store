import { client } from "../redis/client.js";
import { getUser } from "../user/saveUser.js";
import { loginUser } from "../../core/index.js";
import { formatAndSendStoreData } from "../../bot/helpers/formatAndSendStoreData.js";

export const getPollingData = async () => {
  const getPollingData = await client.get("POLLING");

  if (!getPollingData) {
    return [];
  }

  return JSON.parse(getPollingData);
};

export const pollForStore = (bot) => async () => {
  const pollingData = await getPollingData();

  for (const { tgId, playerId } of pollingData) {
    const users = await getUser(tgId);

    if (!users) {
      continue;
    }

    for (const user of users) {
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
    }
  }
};

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
