import { getUser } from "../../utils/user/saveUser.js";
import { formatAndSendStoreData } from "../helpers/formatAndSendStoreData.js";
import { loginUser } from "../../core/index.js";

export const storeHandler = (bot) => async (msg) => {
  const users = await getUser(msg.chat.id);

  if (!users) {
    bot.sendMessage(
      msg.chat.id,
      "You are not registered. Please use /register command to register."
    );

    return;
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
      msg.chat.id
    );
  }
};
