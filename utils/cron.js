import cron from "node-cron";
import moment from "moment";
import cronParser from "cron-parser";

const cronExpression = "0 2 * * *";

export const initCron = (cb) => cron.schedule(cronExpression, cb);

export const getNextCronTime = (task) => {
  let interval = cronParser.parseExpression(cronExpression);

  const nextDate = interval.next().toDate();
  const now = new Date();

  const diffDuration = moment.duration(moment(nextDate).diff(moment(now)));

  const hours = Math.floor(diffDuration.asHours());
  const mins = Math.floor(diffDuration.minutes());
  const secs = Math.floor(diffDuration.seconds());

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
