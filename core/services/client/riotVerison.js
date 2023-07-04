import { client } from "../../../utils/redis/client.js";
import { getAxiosInstance } from "../auth/client.js";

const axios = getAxiosInstance();

const TTL = 60 * 60 * 24;

const getClientVersionFromApi = async () => {
  const { data } = await axios.get("https://valorant-api.com/v1/version");

  return data.data;
};

export const getClientVersion = async () => {
  let clientBuild = await client.get("RIOT_CLIENT_BUILD");

  if (!clientBuild) {
    const version = await getClientVersionFromApi();

    clientBuild = version;

    await client.set("RIOT_CLIENT_BUILD", JSON.stringify(version), {
      EX: TTL,
    });
  }

  return typeof clientBuild === "string"
    ? JSON.parse(clientBuild)
    : clientBuild;
};
