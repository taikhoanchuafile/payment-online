import { createBrowserRouter, RouterProvider } from "react-router";
import AppRouter from "./AppRouter";
import OrderPage from "./pages/OrderPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppRouter,
    children: [
      { index: true, Component: HomePage },
      { path: "/order", Component: OrderPage },
    ],
  },
  { path: "*", Component: NotFoundPage },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
