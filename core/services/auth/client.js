import axios from "axios";

import { getHttpsAgent } from "./agent.js";

const DEFAULT_USER_AGENT =
  "RiotClient/62.0.1.4852117.4789131 rso-auth (Windows;10;;Professional, x64)";

export const getAxiosInstance = () =>
  axios.create({
    headers: {
      "User-Agent": DEFAULT_USER_AGENT,
      "Content-Type": "application/json",
    },
    httpsAgent: getHttpsAgent(),
  });
