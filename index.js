import { bot } from "./bot/bot.js";
import { getNextCronTime, initCron } from "./utils/cron.js";
import { pollForStore } from "./utils/polling/polling.js";

console.log("Bot has started");
const task = initCron(pollForStore(bot));
console.log("Time remaining until next cron job:", getNextCronTime(task));
