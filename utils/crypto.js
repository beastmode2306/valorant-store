import crypto from "crypto";

export const encrypt = (str, secretKey) => {
  const cipher = crypto.createCipher("aes-256-cbc", secretKey);
  let encrypted = cipher.update(str, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decrypt = (str, secretKey) => {
  const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
  let decrypted = decipher.update(str, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
