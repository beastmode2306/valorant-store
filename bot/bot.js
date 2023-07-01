import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

import { startHandler } from "./commands/start.js";
import { registerHandler } from "./commands/register.js";
import { storeHandler } from "./commands/store.js";

bot.onText(/\/start/, startHandler(bot));
bot.onText(/\/register/, registerHandler(bot));
bot.onText(/\/store/, storeHandler(bot));
