import mongoose from "mongoose";

const productOrderSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, // giả sử lấy từ id của Product
    productName: { type: String, required: true, trim: true },
    productDesc: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 1 },
    productPrice: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // giả định lấy từ id của User
    orderCode: { type: Number, required: true, unique: true },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
      index: true,
    },
    products: [productOrderSchema],
    paymentRequest: mongoose.Schema.Types.Mixed,
    transactionRequest: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
