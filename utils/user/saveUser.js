import { client } from "../redis/client.js";
import { encrypt, decrypt } from "../crypto.js";

export const saveUser = async (user) => {
  const { tgId, playerId, username, password } = user;

  let existingConnections = await client.get("USER:" + tgId);
  const encryptedPassword = encrypt(password, process.env.SECRET);
  const player = {
    playerId,
    username,
    password: encryptedPassword,
  };

  if (!existingConnections) {
    existingConnections = [player];
  } else {
    const parsedExistingConnections = JSON.parse(existingConnections);
    const isAlreadyConnected = parsedExistingConnections.some(
      ({ playerId }) => playerId === player.playerId
    );

    if (isAlreadyConnected) throw new Error("Already connected");

    existingConnections = [...parsedExistingConnections, player];
  }
  await client.set("USER:" + tgId, JSON.stringify(existingConnections));
};

export const getUser = async (tgId) => {
  const users = await client.get("USER:" + tgId);

  if (!users) return null;

  const parsedUsers = JSON.parse(users);

  return parsedUsers.map(({ playerId, username, password }) => ({
    playerId,
    username,
    password: decrypt(password, process.env.SECRET),
  }));
};
