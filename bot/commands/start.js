export const startHandler = (bot) => async (msg) =>
  bot.sendMessage(
    msg.chat.id,
    "Welcome to Valorant Store tracker bot!" +
      "\n\n/register - register your account."
  );
