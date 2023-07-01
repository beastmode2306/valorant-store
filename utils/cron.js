import cron from "node-cron";

export const initCron = (cb) => cron.schedule("0 5 * * *", cb);
