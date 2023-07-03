import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

import { startHandler } from "./commands/start.js";
import { registerHandler } from "./commands/register.js";
import { storeHandler } from "./commands/store.js";
import { adminHandler } from "./commands/admin.js";
import { logger } from "../utils/logger.js";

export const initBot = async () => {
  bot.onText(/\/start/, startHandler(bot));
  bot.onText(/\/register/, registerHandler(bot));
  bot.onText(/\/store/, storeHandler(bot));
  bot.onText(/\/admin/, adminHandler(bot));

  logger.info("Bot started!");

  return bot;
};

export const handleErrors = (error) => {
  logger.error(error, "Bot has crashed!");
  bot.sendMessage(
    process.env.BOT_ADMIN_ID,
    `Bot has crashed! ${JSON.stringify(error, null, 2)}`
  );
};
