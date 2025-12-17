import { api } from "../api/axios";
import type { ProductPayload } from "../types/product.type";

export const getOrderService = async (userId: string) => {
  const res = await api.get(`/orders/${userId}`);
  return res.data;
};

export const addToCartService = async (
  userId: string,
  product: ProductPayload
) => {
  const res = await api.post("/orders/add", { userId, product });
  return res.data;
};

export const getPaymentLinkInService = async (userId: string) => {
  const res = await api.post("/orders/payos", { userId });
  return res.data;
};
