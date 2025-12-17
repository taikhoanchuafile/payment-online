import { useOutletContext } from "react-router";
import { userOrderStore } from "../stores/order.store";
import { BanknoteArrowUp, CircleDashed, Undo2 } from "lucide-react";
import { toast } from "react-toastify";

const OrderPage = () => {
  const { userId }: { userId: string } = useOutletContext();
  const pending = userOrderStore((state) => state.pending);
  const getPaymentLinkIn = userOrderStore((state) => state.getPaymentLinkIn);

  if (pending.length < 1) {
    return (
      <div className="text-xl flex flex-col gap-8 items-center">
        <CircleDashed className="size-20" /> Không có sản phẩm trong giỏ hàng
        <a
          href="/"
          target="_parent"
          rel="noopener noreferrer"
          className="mt-8 px-4 py-2 rounded-2xl shadow-md bg-neutral-900 text-neutral-100 hover:bg-neutral-500 flex gap-2 items-center"
        >
          Trờ về <Undo2 />
        </a>
      </div>
    );
  }

  const handlePayment = async () => {
    await getPaymentLinkIn(userId);
    toast.success(
      "Bạn sẽ được chuyển đến trang thanh toán, vui lòng quét mã để thanh toán!"
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mt-4 text-center">
        <div className="grid grid-cols-5 font-bold underline underline-offset-4">
          <div>Tên sản phẩm</div>
          <div>Mô tả</div>
          <div>Số lượng</div>
          <div>Giá</div>
          <div>Thành tiền</div>
        </div>

        {pending[0]?.products &&
          pending[0].products.map((product, index) => {
            return (
              <div key={index} className="grid grid-cols-5">
                <h2 className="text-xl capitalize">{product.productName}</h2>
                <p>{product.productDesc}</p>
                <p>{product.quantity}</p>
                <p>{product.productPrice} VNĐ</p>
                <p>{product.quantity * product.productPrice} VNĐ</p>
              </div>
            );
          })}
      </div>
      <div className="flex gap-8 justify-center">
        <button
          onClick={handlePayment}
          className="mt-8 px-4 py-2 rounded-2xl shadow-md bg-green-900 text-neutral-100 hover:bg-green-500 cursor-pointer flex items-center gap-2"
        >
          <BanknoteArrowUp />
          Thanh toán
        </button>
        <a
          href="/"
          target="_parent"
          rel="noopener noreferrer"
          className="mt-8 px-4 py-2 rounded-2xl shadow-md bg-neutral-900 text-neutral-100 hover:bg-neutral-500 flex gap-2 items-center"
        >
          Trờ về <Undo2 />
        </a>
      </div>
    </div>
  );
};

export default OrderPage;
