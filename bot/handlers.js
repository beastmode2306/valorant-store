export const handleExceptionInvalidCredentials = (bot, chatId) => {
  bot.sendMessage(chatId, "Invalid credentials! Try again...");
};

export const handleExceptionAlreadyConnected = (bot, chatId) => {
  bot.sendMessage(chatId, "You are already registered!");
};

export const handleSuccessRegistration = (bot, chatId, playerId) => {
  bot.sendMessage(chatId, "Successfully registered!");
};
