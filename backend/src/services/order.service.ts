import Order from "../models/order.model";
import { OrderPayload } from "../types/order.type";
import { ProductPayload } from "../types/product.type";

export const findOrderByUserIdService = async (
  userId: string,
  status = "PENDING"
) => {
  return await Order.findOne({ userId, status });
};

export const findOrderByCodedService = async (orderCode: number) => {
  return await Order.findOne({ orderCode });
};

export const updateOrderByCodeService = async (
  orderCode: number,
  payload: Partial<OrderPayload<ProductPayload>>
) => {
  return await Order.updateOne({ orderCode }, { $set: payload });
};
