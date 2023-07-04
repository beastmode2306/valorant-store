import axios from "axios";

import { getHttpsAgent } from "./agent.js";

export const getAxiosInstance = () =>
  axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    httpsAgent: getHttpsAgent(),
  });
