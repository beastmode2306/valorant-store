import {
  fetchAccessToken,
  fetchEntitlementToken,
  fetchPlayerId,
} from "./services/auth/login.js";
import { getPlayerStore } from "./services/skins/store.js";
import { getSkin } from "./services/skins/skins.js";

export const loginUser = async (credentials) => {
  const { username, password } = credentials;
  const { access_token } = await fetchAccessToken(username, password);
  const { entitlements_token } = await fetchEntitlementToken(access_token);
  const playerId = await fetchPlayerId(access_token);

  return { access_token, entitlements_token, playerId };
};

export const getTodayStore = async (credentials) => {
  const { access_token, entitlements_token, playerId } = credentials;

  const store = await getPlayerStore({
    playerId,
    accessToken: access_token,
    entitlementToken: entitlements_token,
    region: "eu",
  });

  const skins = [];

  for await (const { OfferID, Cost } of store.SkinsPanelLayout
    .SingleItemStoreOffers) {
    const skin = await getSkin(OfferID);
    skins.push({ skin, cost: Cost });
  }

  return skins;
};
