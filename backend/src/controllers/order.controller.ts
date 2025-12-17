import { Response, Request } from "express";
import Order from "../models/order.model";

/**
 * Giả sử thêm sản phẩm vào giỏ hàng ở trạng thái người dùng đã đăng nhập
 * @param req {userId, {product}}
 * @param res {order}
 * @returns
 */

// Thêm danh sách sản phẩm vào trong order( giở hảng)
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { userId, product } = req.body;
    //   Kiểm tra dữ liệu
    if (!userId || !product) {
      return res.status(400).json({ message: "Thiếu dữ liệu!" });
    }

    // Kiểm tra sản phẩm thêm vào có tồn tại hay không?
    // Thất bại trả null khi  không có sản phẩm bên trong trùng hoặc giỏ hàng chưa lập
    let order = await Order.findOneAndUpdate(
      { userId, status: "PENDING", "products.productId": product.productId }, // điều kiện của $ nằm ô 3
      {
        $inc: { "products.$.quantity": 1 }, //duyệt products với điều $ để tìm ra phần tử, nếu có thì phantu.quantity tăng 1
      },
      { new: true }
    );

    // Kiểm tra sản phẩm giỏ hàng đã lập hay chưa
    // Tạo rồi thì push sản phẩm vào
    // Thất bại trả lệnh phát động tạo mới() thay vì trả về null
    if (!order) {
      order = await Order.findOneAndUpdate(
        { userId, status: "PENDING" },
        {
          //khu này chạy cùng 1 lúc, không phải chạy lần lượt
          $push: { products: product },
          $setOnInsert: { userId, orderCode: Date.now(), status: "PENDING" }, //chạy khi phát động tạo mới - lệnh của upsert: true,
        },
        {
          new: true,
          upsert: true, // thất bại thì insert(tạo mới) thay vì trả null
        }
      );
    }

    // return
    return res.status(200).json({ order });
  } catch (error) {
    console.error("Lỗi khi gọi createOrderController", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// lấy thông tin của đơn hàng trạng thái pending
export const getOrderController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await Order.aggregate([
      { $match: { userId } },
      { $sort: { updatedAt: 1 } },
      {
        $facet: {
          pending: [{ $match: { status: "PENDING" } }],
          notPending: [{ $match: { status: { $ne: "PENDING" } } }],
        },
      },
    ]);
    return res.status(200).json({
      pending: orders[0].pending,
      notPending: orders[0].notPending,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getOrderController", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
