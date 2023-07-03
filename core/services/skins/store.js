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

const getPlayerWallet = async (credentials) => {
  const {
    playerId,
    accessToken,
    entitlementToken,
    region = "eu",
  } = credentials;

  const url = `https://pd.${region}.a.pvp.net/store/v1/wallet/${playerId}`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Riot-Entitlements-JWT": entitlementToken,
  };

  const { data } = await axios.get(url, { headers });

  return {
    vp: data.Balances["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"],
    rad: data.Balances["e59aa87c-4cbf-517a-5983-6e81511be9b7"],
    kc: data.Balances["85ca954a-41f2-ce94-9b45-8ca3dd39a00d"],
  };
};

export { getPlayerStore, getPlayerStorefront, getPlayerWallet };
