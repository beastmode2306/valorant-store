import { getTodayStore, loginUser } from "../../core/index.js";
import { formatStoreMessages } from "../formatter.js";
import { generateCollage } from "../../utils/ffmpeg/engine.js";
import { getPlayerWallet } from "../../core/services/skins/store.js";

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

  const walletData = await getPlayerWallet({
    accessToken: access_token,
    entitlementToken: entitlements_token,
    playerId,
  });

  const balancesString = `*Valorant Points:* ${walletData.vp}\n*Radianite Points:* ${walletData.rad}
  `;

  await bot.sendPhoto(chatId, collagePath, {
    caption:
      `Today's store for *${username}*:\n
` +
      messages.join("\n") +
      `\n\n*Balances:*\n${balancesString}`,
    parse_mode: "Markdown",
  });
};
