// src/api/apiClient.js
import axios from "axios";
import config from "../core/config";

export const ApiClient = axios.create({
  baseURL: `${config.backend_url}/api/v1/user/`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
