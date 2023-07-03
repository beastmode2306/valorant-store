import { getPollingData } from "../../utils/polling/polling.js";

export const adminHandler = (bot) => async (msg) => {
  if (msg.chat.id == process.env.BOT_ADMIN_ID) {
    const pollingData = await getPollingData();
    bot.sendMessage(
      msg.chat.id,
      `Polling data: \n\n\`${JSON.stringify(pollingData, null, 2)}\``,
      {
        parse_mode: "Markdown",
      }
    );
  }
};
