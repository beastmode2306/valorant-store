import axios from "axios";

const getPlayerStore = async (credentials) => {
  const { data } = await getPlayerStorefront(credentials);

  return data;
};

const getPlayerStorefront = (credentials) => {
  const {
    playerId,
    accessToken,
    entitlementToken,
    region = "eu",
  } = credentials;

  const url = `https://pd.${region}.a.pvp.net/store/v2/storefront/${playerId}`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Riot-Entitlements-JWT": entitlementToken,
  };

  return axios.get(url, { headers });
};

export { getPlayerStore, getPlayerStorefront };
