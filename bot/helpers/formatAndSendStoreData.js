import { getTodayStore, loginUser } from "../../core/index.js";
import { formatStoreMessages } from "../formatter.js";
import { generateCollage } from "../../utils/ffmpeg/engine.js";

export const formatAndSendStoreData = async (
  { access_token, entitlements_token, playerId, username },
  bot,
  chatId
) => {
  const store = await getTodayStore({
    access_token,
    entitlements_token,
    playerId,
  });

  const messages = formatStoreMessages(store);

  const collageInput = store.map(({ skin, cost }) => {
    return {
      url: skin.displayIcon,
      name: skin.displayName,
      price: Object.values(cost).at(-1),
    };
  });

  const collagePath = await generateCollage(collageInput, chatId, playerId);

  await bot.sendPhoto(chatId, collagePath, {
    caption:
      `Today's store for *${username}*:\n
` + messages.join("\n"),
    parse_mode: "Markdown",
  });
};
