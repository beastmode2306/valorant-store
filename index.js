import { handleErrors, initBot } from "./bot/bot.js";
import { getNextCronTime, initCron } from "./utils/cron.js";
import { pollForStore } from "./utils/polling/polling.js";

const bot = await initBot().catch(handleErrors);

const task = initCron(pollForStore(bot));
console.log("Time remaining until next cron job:", getNextCronTime(task));
