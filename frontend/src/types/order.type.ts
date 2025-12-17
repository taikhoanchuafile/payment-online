import type { ProductPayload } from "./product.type";

interface Order<T> {
  userId: string;
  orderCode: number;
  status: "PENDING" | "PAID" | "FAILED";
  products: T[];
  paymentRequest?: any;
  transactionRequest?: any;
}

export interface OrderState {
  isloading: boolean;
  notPending: Order<ProductPayload>[] | [];
  pending: Order<ProductPayload>[] | [];

  setPening: (pending: Order<ProductPayload>[]) => void;
  setNotPening: (notPending: Order<ProductPayload>[]) => void;

  getOrder: (userId: string) => Promise<void>;
  addToCart: (userId: string, product: ProductPayload) => Promise<void>;
  getPaymentLinkIn: (userId: string) => Promise<void>;
}
