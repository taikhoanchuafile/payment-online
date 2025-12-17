import { SignaturePayload } from "../types/order.type";
import crypto from "crypto";
import { env } from "../config/env";
import axios from "axios";
import { api } from "../api/axios";

const {
  FRONTEND_URL,
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
  PAYOS_BASE_URL,
} = env;

// function từ signature của payos
function sortObjDataByKey(object: any) {
  const orderedObject = Object.keys(object)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  return orderedObject;
}
// function từ signature của payos
function convertObjToQueryStr(object: any) {
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];
      // Sort nested object
      if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
      }
      // Set empty string if null
      if ([null, undefined, "undefined", "null"].includes(value)) {
        value = "";
      }

      return `${key}=${value}`;
    })
    .join("&");
}

// Tạo signatu
export const createSignatureService = (payload: SignaturePayload) => {
  const sortedDataByKey = sortObjDataByKey(payload);
  const dataQueryStr = convertObjToQueryStr(sortedDataByKey);
  const dataToSignature = crypto
    .createHmac("sha256", PAYOS_CHECKSUM_KEY!)
    .update(dataQueryStr)
    .digest("hex");
  return dataToSignature;
  //   const { amount, cancelUrl, description, orderCode, returnUrl } = payload;
  //   const data = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
  //   return crypto
  //     .createHmac("sha256", PAYOS_CHECKSUM_KEY!)
  //     .update(data)
  //     .digest("hex");
};

// gọi API PAYOS lấy PaymentLink
export const createPaymentLinkService = async (
  orderCode: number,
  amount: number
) => {
  // chuẩn bị trường dữ liệu bắt buộc
  const body = {
    orderCode,
    amount,
    description: "NTVPAYTOWIN",
    cancelUrl: `${FRONTEND_URL}`,
    returnUrl: `${FRONTEND_URL}`,
  };

  //Tạo chữ ký signature
  const signature = createSignatureService(body);

  //Gọi API PAYOS lấy linh thanh toán
  const res = await api.post("/", { ...body, signature });
  return res.data;
};

// getPaymentLinkInformation - Lấy thông tin đơn hàng trên PAYOS
export const getPaymentLinkInformationService = async (orderCode: number) => {
  return api.get(`/${orderCode}`);
};

// cancelPamentService - Hủy thanh toán đơn hàng trên Payos
export const cancelPaymentService = async (orderCode: number) => {
  return api.post(`/${orderCode}/cancel`);
};

/**
 *
 * @param object verifySignature
 * @returns boolean
 */
function isValidData(data: any, currentSignature: string) {
  const sortedDataByKey = sortObjDataByKey(data);
  const dataQueryStr = convertObjToQueryStr(sortedDataByKey);
  const dataToSignature = crypto
    .createHmac("sha256", PAYOS_CHECKSUM_KEY!)
    .update(dataQueryStr)
    .digest("hex");
  return dataToSignature == currentSignature;
}

export const verifySignatureService = (data: any, signature: string) => {
  return isValidData(data, signature);
};
