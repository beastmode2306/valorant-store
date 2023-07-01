import querystring from "querystring";
import { endpoints } from "../../../config/index.js";
import { getAxiosInstance } from "./client.js";

const axios = getAxiosInstance();

const _reqCookie = async (url) => {
  const body = {
    client_id: "play-valorant-web-prod",
    nonce: 1,
    redirect_uri: "https://playvalorant.com/opt_in",
    response_type: "token id_token",
    scope: "account openid",
  };

  const req = await axios.post(url, body);

  return req?.headers["set-cookie"]?.join("; ");
};

const _reqAccessToken = (url, headers, credentials) => {
  const { username, password } = credentials;
  const body = {
    type: "auth",
    username,
    password,
  };

  return axios.put(url, body, {
    headers,
  });
};

const fetchPlayerId = async (accessToken) => {
  const url = `${endpoints.accessToken}/userinfo`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const { data } = await axios.get(url, { headers });

  return data?.sub;
};

const fetchEntitlementToken = async (accessToken) => {
  const url = `${endpoints.entitlementsToken}/api/token/v1`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const { data } = await axios.post(url, {}, { headers });

  return data;
};

const fetchAccessToken = async (username, password) => {
  const url = `${endpoints.accessToken}/api/v1/authorization`;

  const cookies = await _reqCookie(url);

  if (!cookies) {
    throw new Error("Failed to get cookies");
  }

  const { data } = await _reqAccessToken(
    url,
    {
      cookie: cookies,
    },
    { username, password }
  );

  if (!data.response) {
    throw new Error("Invalid credentials");
  }

  return querystring.parse(data.response.parameters.uri.split("#")[1]);
};

export { fetchAccessToken, fetchEntitlementToken, fetchPlayerId };
