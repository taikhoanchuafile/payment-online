import { Request, Response } from "express";
import {
  findOrderByCodedService,
  findOrderByUserIdService,
  updateOrderByCodeService,
} from "../services/order.service";
import {
  cancelPaymentService,
  createPaymentLinkService,
  getPaymentLinkInformationService,
  verifySignatureService,
} from "../services/payos.service";

// Khi người dùng ấn thanh toán để nhận Mã QR
export const createPaymentLinkController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Người dùng chưa đăng nhập!" });
    }

    // Kiểm tra đơn hàng trên DB theo userId
    const order = await findOrderByUserIdService(userId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
    }

    let newOrderCode = order.orderCode; //chứa mã đơn hàng mới để tạo mới paymentlink nếu link cũ vô hiệu
    // tính tồng tiền đơn hàng trên DB
    const amount = order.products.reduce(
      (sum, value) => sum + value.quantity * value.productPrice,
      0
    );

    // Lấy thông tin thanh toán đơn hàng này trên payos
    const payosDataInfo = await getPaymentLinkInformationService(
      order.orderCode
    );
    if (payosDataInfo.data.code === "00") {
      switch (payosDataInfo.data.data.status) {
        // Nếu trạng thái TTĐH payos là CANCELLED thì đổi mã đơn hàng mới
        case "CANCELLED":
          newOrderCode = Date.now();
          break;
        case "PENDING":
          // Mếu giá đơn hàng thay đổi thì break
          if (amount !== order.paymentRequest.amount) {
            await cancelPaymentService(order.orderCode);
            newOrderCode = Date.now();
            break;
          }
          // Nếu trạng thái TTĐH payos là PENDING thì dùng lại checkUrl của order cũ
          return res
            .status(200)
            .json({ payosData: order.paymentRequest.checkoutUrl });
        default:
          break;
      }
    }

    //Tạo link thanh toán mới
    const payosData = await createPaymentLinkService(newOrderCode, amount);
    if (payosData.code !== "00") {
      return res.status(403).json("Lỗi truy vấn!");
    }

    // lưu payment request của payos để theo dõi
    await updateOrderByCodeService(order.orderCode, {
      orderCode: newOrderCode,
      paymentRequest: payosData.data,
    });

    // Trả về dữ liệu cho FE
    return res.status(200).json({ payosData: payosData.data.checkoutUrl });
  } catch (error) {
    console.error("Lỗi khi gọi createPaymentLink", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Khi người dùng thanh toán quét QR thì PAYOS sẽ gửi request lên url webhook
export const webhookHandleController = async (req: Request, res: Response) => {
  try {
    // req.body ở dạng buffer => chuỗi json => object
    const rawBuffer = req.body;
    const { code, data, signature } = JSON.parse(rawBuffer.toString());

    // verify signature
    if (!verifySignatureService(data, signature)) {
      return res.sendStatus(204);
    }

    // Kiểm tra so sánh mã đơn hàng với đơn hàng trong db
    const order = await findOrderByCodedService(data.orderCode);
    if (!order) {
      return res.sendStatus(204);
    }

    // kiểm tra so sánh giá tiền payos và db
    const amount = order.products.reduce(
      (sum, value) => sum + value.quantity * value.productPrice,
      0
    );
    if (amount !== Number(data.amount)) {
      return res.sendStatus(204);
    }
    // cập nhật trạng thái trong db nếu code === 00
    if (code === "00") {
      await updateOrderByCodeService(data.orderCode, {
        status: "PAID",
        transactionRequest: data,
      });
    } else {
      await updateOrderByCodeService(data.orderCode, {
        status: "FAILED",
        transactionRequest: data,
      });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi webhookHandleController", error);
    return res.sendStatus(204);
  }
};
