import { bot } from "./bot/bot.js";
import { initCron } from "./utils/cron.js";
import { pollForStore } from "./utils/polling/polling.js";

initCron(pollForStore(bot));

console.log("Bot has started");
