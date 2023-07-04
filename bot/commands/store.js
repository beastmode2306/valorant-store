import { getUsers } from "../../utils/user/saveUser.js";
import { sendUserStore } from "../helpers/sendUserStore.js";

export const storeHandler = (bot) => async (msg) => {
  const users = await getUsers(msg.chat.id);

  if (!users) {
    bot.sendMessage(
      msg.chat.id,
      "You are not registered. Please use /register command to register."
    );

    return;
  }

  for (const user of users) {
    sendUserStore({ user, tokens: null }, bot, msg.chat.id);
  }
};
