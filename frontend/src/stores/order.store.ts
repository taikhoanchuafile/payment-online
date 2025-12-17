import { create } from "zustand";
import type { OrderState } from "../types/order.type";
import type { ProductPayload } from "../types/product.type";
import {
  addToCartService,
  getOrderService,
  getPaymentLinkInService,
} from "../services/order.service";
import { toast } from "react-toastify";

export const userOrderStore = create<OrderState>((set, get) => ({
  isloading: false,

  notPending: [],
  pending: [],

  setPening: (pending) => set({ pending }),
  setNotPening: (notPending) => set({ notPending }),

  getOrder: async (userId: string) => {
    try {
      const { setPening, setNotPening } = get();
      set({ isloading: true });

      const { pending, notPending } = await getOrderService(userId);
      setPening(pending);
      setNotPening(notPending);
    } catch (error) {
      console.error("Lỗi khi gọi getOrder", error);
    } finally {
      set({ isloading: false });
    }
  },

  addToCart: async (userId: string, product: ProductPayload) => {
    try {
      set({ isloading: true });
      const { order } = await addToCartService(userId, product);
      get().setPening([order]);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi gọi addToCart", error);
      toast.success("Mua sản phẩm thất bại!");
    } finally {
      set({ isloading: false });
    }
  },

  getPaymentLinkIn: async (userId: string) => {
    try {
      set({ isloading: true });
      const { payosData } = await getPaymentLinkInService(userId);
      window.location.href = payosData;
    } catch (error) {
      console.error("Lỗi khi gọi getPaymentLinkIn", error);
    } finally {
      set({ isloading: false });
    }
  },
}));
