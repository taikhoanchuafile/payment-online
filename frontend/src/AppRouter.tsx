import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import { Outlet } from "react-router";
import { userOrderStore } from "./stores/order.store";
import { ToastContainer } from "react-toastify";

const arrNum = [
  {
    value: "222222",
    label: "User 1",
  },
  {
    value: "333333",
    label: "User 2",
  },
];

const AppRouter = () => {
  const [userId, setUserId] = useState(arrNum[0].value);
  const getOrder = userOrderStore((state) => state.getOrder);

  const isloading = userOrderStore((state) => state.isloading);

  useEffect(() => {
    const getOrderByUserId = async (userId: string) => {
      await getOrder(userId);
    };
    getOrderByUserId(userId);
  }, [userId]);

  if (isloading) {
    return <div>Loading.......</div>;
  }

  return (
    <div className="flex items-center justify-center">
      <ToastContainer />
      <Nav userId={userId} arrNum={arrNum} setUserId={setUserId}></Nav>
      <div className="mt-25 px-8 py-4 max-w-384 w-full">
        <Outlet context={{ userId, arrNum }}></Outlet>
      </div>
    </div>
  );
};

export default AppRouter;
