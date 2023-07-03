import cron from "node-cron";
import moment from "moment";
import cronParser from "cron-parser";
import { logger } from "./logger.js";

const cronExpression = "0 2 * * *";

export const initCron = (cb) => {
  logger.info(
    "Cron has been registered to be executed at: %s. Time remaining until next cron job: %s",
    ...getCronTime()
  );

  return cron.schedule(cronExpression, cb);
};

const formatTime = (hours, mins, secs) => {
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const getCronTime = () => {
  let interval = cronParser.parseExpression(cronExpression);

  const nextDate = interval.next().toDate();
  const now = new Date();

  const diffDuration = moment.duration(moment(nextDate).diff(moment(now)));

  const hours = Math.floor(diffDuration.asHours());
  const mins = Math.floor(diffDuration.minutes());
  const secs = Math.floor(diffDuration.seconds());

  return [
    formatTime(
      nextDate.getHours(),
      nextDate.getMinutes(),
      nextDate.getSeconds()
    ),
    formatTime(hours, mins, secs),
  ];
};
