import {
  handleExceptionAlreadyConnected,
  handleExceptionInvalidCredentials,
  handleSuccessRegistration,
} from "../handlers.js";
import { loginUser } from "../../core/index.js";
import { saveUser } from "../../utils/user/saveUser.js";
import { registerPolling } from "../../utils/polling/polling.js";
import { logger } from "../../utils/logger.js";
import { sendUserStore } from "../helpers/sendUserStore.js";

export const registerHandler = (bot) => async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    "Please enter your username and password in the following format:\n\nusername:password"
  );

  bot.onText(/^[a-zA-Z0-9_]{3,16}:[a-zA-Z0-9_]{3,16}$/, async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    const [username, password] = text.split(":");

    if (!username || !password)
      return handleExceptionInvalidCredentials(bot, chatId);

    const user = {
      tgId: chatId,
      username,
      password,
    };

    try {
      const { access_token, entitlements_token, playerId } = await loginUser({
        username,
        password,
      });

      logger.debug({
        access_token,
        entitlements_token,
        playerId,
      });

      await saveUser({
        ...user,
        playerId,
      });

      logger.info(`New user ${username} has registered`);

      await registerPolling(chatId, playerId);

      await handleSuccessRegistration(bot, chatId, playerId);

      sendUserStore(
        { user, tokens: { access_token, entitlements_token, playerId } },
        bot,
        chatId
      );
    } catch (err) {
      if (err.message === "Invalid credentials")
        return handleExceptionInvalidCredentials(bot, chatId);
      else if (err.message === "Already connected")
        return handleExceptionAlreadyConnected(bot, chatId);
    } finally {
      bot.removeTextListener(/^[a-zA-Z0-9_]{3,16}:[a-zA-Z0-9_]{3,16}$/);
    }
  });
};
