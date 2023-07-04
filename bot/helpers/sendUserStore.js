import Queue from "queue";
import { logger } from "../../utils/logger.js";
import { loginUser } from "../../core/index.js";
import { formatAndSendStoreData } from "./formatAndSendStoreData.js";

const q = new Queue({ autostart: true, concurrency: 1 });

export const sendUserStore = ({ user, tokens }, bot, chatId) => {
  logger.info(
    `Adding task for user ${
      user.username
    } to the queue. Current queue length: ${q.length + 1}.`
  );

  if (!user && !tokens) {
    logger.error("No user or tokens provided to sendUserStore");
    return;
  }

  q.push(async (cb) => {
    if (!tokens) {
      tokens = await loginUser(user);
    }

    await formatAndSendStoreData(
      {
        ...tokens,
        username: user.username,
      },
      bot,
      chatId
    );

    cb();
    logger.info(
      `Task for user ${user.username} completed. Remaining tasks in the queue: ${q.length}.`
    );
  });
};
