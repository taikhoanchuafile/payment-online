import { useState } from "react";
import { userOrderStore } from "../stores/order.store";
import { useOutletContext } from "react-router";
import type { ProductPayload } from "../types/product.type";
import { toast } from "react-toastify";

const arr = [
  {
    productId: "1",
    productName: "Sản phẩm A",
    productDesc: "Đây là mô tả sản phẩm A",
    quantity: 1,
    productPrice: 1000,
    imgUrl: "/rocket.svg",
    alt: "rocket icon",
  },
  {
    productId: "2",
    productName: "Sản phẩm B",
    productDesc: "Đây là mô tả sản phẩm B",
    quantity: 1,
    productPrice: 1000,
    imgUrl: "/laptop.svg",
    alt: "/laptop icon",
  },
];

const HomePage = () => {
  const {
    userId,
    arrNum,
  }: { userId: string; arrNum: { value: string; label: string }[] } =
    useOutletContext();

  const [productsByOrderCode, setProductsByOrderCode] = useState<
    ProductPayload[]
  >([]);

  const notPending = userOrderStore((state) => state.notPending);
  const addToCart = userOrderStore((state) => state.addToCart);

  const handleOrderDetails = (orderCode: number) => {
    const order = notPending?.find((val) => val.orderCode === orderCode);
    if (order) {
      setProductsByOrderCode(order.products);
    }
    toast.success("Chi tiết đơn hàng sẽ hiển thị ở cột bên phải!");
  };

  const handleAddToCard = async (product: any) => {
    const body = {
      productId: product.productId,
      productName: product.productName,
      productDesc: product.productDesc,
      quantity: product.quantity,
      productPrice: product.productPrice,
    };
    await addToCart(userId, body);
    toast.success("Sản phẩm đã được đưa vào giỏ hàng!");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1 flex gap-4 flex-wrap justify-around">
        {arr.map((product, index) => {
          return (
            <div key={index} className="flex gap-2 items-center">
              <img className="size-40" src={product.imgUrl} alt={product.alt} />
              <div className="space-y-4">
                <h2 className="text-xl font-bold capitalize">
                  {product.productName}
                </h2>
                <div>
                  <p>{product.productDesc}</p>
                  <p>{product.productPrice} VNĐ</p>
                </div>
                <button
                  onClick={() => handleAddToCard(product)}
                  className="px-4 py-2 rounded-2xl bg-green-900 text-neutral-100 hover:bg-green-500 shadow-2xl cursor-pointer"
                >
                  Mua
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* s */}
      <hr />
      {/* s */}
      <div className="flex-1 text-center">
        <h1 className="text-2xl font-bold capitalize leading-none tracking-wide p-4 bg-neutral-300 shadow-md">
          Lịch sử mua hàng
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 mt-4 text-center border-r px-4">
            <div className="grid grid-cols-4 font-bold justify-around underline underline-offset-4">
              <div>Mã đơn hàng</div>
              <div>Tên người mua</div>
              <div>Trạng thái</div>
              <div>Thời gian</div>
            </div>
            {notPending?.map((np, index) => {
              return (
                <div key={index} className="grid grid-cols-4 justify-around ">
                  <div
                    onClick={() => handleOrderDetails(np.orderCode)}
                    className="text-blue-500 underline underline-offset-2 cursor-pointer"
                  >
                    {np.orderCode}
                  </div>
                  <div>
                    {arrNum.find((val) => val.value === np.userId)?.label}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl bg-green-600 font-semibold ${
                      np.status === "PAID" ? "" : "bg-red-600"
                    }
                  `}
                  >
                    {np.status === "PAID" ? "Đã thanh toán" : "Hủy"}
                  </div>
                  <div>{np.transactionRequest.transactionDateTime}</div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-4 mt-4 text-center">
            <div className="grid grid-cols-5 font-bold underline underline-offset-4">
              <div>Tên sản phẩm</div>
              <div>Mô tả</div>
              <div>Số lượng</div>
              <div>Giá</div>
              <div>Thành tiền</div>
            </div>

            {productsByOrderCode.length > 0 ? (
              productsByOrderCode.map((product, index) => {
                return (
                  <div key={index} className="grid grid-cols-5">
                    <h2 className="text-xl capitalize">
                      {product.productName}
                    </h2>
                    <p>{product.productDesc}</p>
                    <p>{product.quantity}</p>
                    <p>{product.productPrice} VNĐ</p>
                    <p>{product.quantity * product.productPrice} VNĐ</p>
                  </div>
                );
              })
            ) : (
              <div>(Ấn vào mã đơn hàng để xem chi tiết)</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
