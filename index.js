import { handleErrors, initBot } from "./bot/bot.js";
import { initCron } from "./utils/cron.js";
import { pollForStore } from "./utils/polling/polling.js";

const bot = await initBot().catch(handleErrors);

initCron(pollForStore(bot));
