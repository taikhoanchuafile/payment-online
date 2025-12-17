import dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  MONGODB_URL,
  FRONTEND_URL,
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
  PAYOS_BASE_URL,
} = process.env;

export const env = {
  PORT,
  MONGODB_URL,
  FRONTEND_URL,
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
  PAYOS_BASE_URL,
};
