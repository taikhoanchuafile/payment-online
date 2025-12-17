import { ShoppingCart } from "lucide-react";
import { userOrderStore } from "../stores/order.store";

const Nav = ({
  userId,
  setUserId,
  arrNum,
}: {
  userId: string;
  setUserId: (value: string) => void;
  arrNum: { value: string; label: string }[];
}) => {
  const pending = userOrderStore((state) => state.pending);
  return (
    <div className="max-h-25 max-w-384 w-full h-full p-2 bg-cyan-200 flex justify-between fixed top-0">
      <div className="flex justify-around w-[20%]">
        {arrNum.map((value, index) => {
          return (
            <button
              key={index}
              onClick={() => setUserId(value.value)}
              className={`px-4 py-2 rounded-2xl bg-neutral-50 hover:bg-neutral-500 cursor-pointer opacity-50 ${
                userId === value.value
                  ? "bg-red-500 text-neutral-50 opacity-100 transition duration-500 font-semibold shadow-md"
                  : ""
              }`}
            >
              {value.label}
            </button>
          );
        })}
      </div>
      <a
        href="/order"
        className="flex gap-2 items-center px-4 py-2 rounded-full bg-neutral-100 shadow-md hover:shadow-xl hover:scale-110 hover:bg-neutral-300 transition duration-500"
      >
        <div className="relative border p-2 rounded-full bg-amber-600">
          <ShoppingCart />
          <span className="absolute -top-7 right-0 text-2xl font-bold rounded-4xl bg-linear-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            {pending[0]?.products?.reduce(
              (sum, val) => sum + val.quantity,
              0
            ) ?? 0}
          </span>
        </div>
        <h2 className="text-xl font-semibold">Giỏ hàng</h2>
      </a>
    </div>
  );
};

export default Nav;
