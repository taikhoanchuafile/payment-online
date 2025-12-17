export interface OrderPayload<T> {
  userId: string;
  orderCode: number;
  status?: "PENDING" | "PAID" | "FAILED";
  products: T[];
  paymentRequest: any;
  transactionRequest: any;
}

export interface SignaturePayload {
  amount: number;
  cancelUrl: string;
  description: string;
  orderCode: number;
  returnUrl: string;
}
