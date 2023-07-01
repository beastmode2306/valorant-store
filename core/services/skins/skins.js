import { client } from "../../../utils/redis/client.js";
import axios from "axios";

const getSkinFromApi = async (skinId) => {
  const { data } = await axios.get(
    `https://valorant-api.com/v1/weapons/skinlevels/${skinId}`
  );

  return data.data;
};

export const getSkin = async (uuid) => {
  let skin = await client.get("SKIN:" + uuid);

  if (!skin) {
    skin = await getSkinFromApi(uuid);
    await client.set("SKIN:" + uuid, JSON.stringify(skin));
  }

  return typeof skin === "string" ? JSON.parse(skin) : skin;
};
