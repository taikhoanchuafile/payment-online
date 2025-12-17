import axios from "axios";
import { env } from "../config/env";

const baseURL = "https://api-merchant.payos.vn/v2/payment-requests";
export const api = axios.create({
  baseURL,
  headers: {
    "x-api-key": env.PAYOS_API_KEY,
    "x-client-id": env.PAYOS_CLIENT_ID,
    "Content-Type": "application/json",
  },
});
