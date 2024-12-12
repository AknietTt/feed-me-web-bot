import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import SelectCity from "./page/SelectCity/SelectCity.jsx";
import Restaurnts from "./page/Restaurants/Restaurnts.jsx";
import Menu from "./page/Menu/Menu.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import Order from "./page/Order/Order.jsx";
import Branch from "./page/Branch/Branch.jsx";
import Done from "./page/Done/Done.jsx";
import AppLayout from "./components/AppLayout/AppLayout.jsx";
import Pickup from "./page/Pickup/Pickup.jsx";
import Reservation from "./page/Reservation/Reservation.jsx";
import BranchTable from "./page/BranchTable/BranchTable.jsx";
import TableList from "./page/TableList/TableList.jsx";
import ReservationForm from "./page/ReservationForm/ReservationForm.jsx";
import QRMenu from "./page/QRMenu/QRMenu.jsx";
import OrderTable from "./page/OrderTable/OrderTable.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SelectCity />, // Страница выбора города
  },
  {
    path: "/done",
    element: <Done />, // Страница завершения
  },
  {
    path:"/qr/order",
    element:<QRMenu/>
  },
  {
    path:"/restaurant/:restaurantId/table/:tableId/order",
    element:<OrderTable/>
  },
  {
    path: "/:cityId",
    element: <AppLayout />, // Обертка с Bottom Navigation
    children: [
      {
        path: "restaurant",
        element: <Restaurnts />, // Список ресторанов
      },
      {
        path: "menu/:restaurantId",
        element: <Menu />, // Меню ресторана
      },
      {
        path: "order",
        element: <Order />, // Заказы
      },
      {
        path: "pickup",
        element: <Pickup />, // Самовывоз
      },
      {
        path: "booking",
        element: <Reservation />, // Бронирование
      },
      {
        path: "qrmenu",
        element: <Reservation />, // QR-меню
      },
      {
        path: "branch/:restaurantId",
        element: <Branch />, // Филиалы ресторанов
      },
      {
        path: "branches-with-tables/:restaurantId",
        element: <BranchTable />, // Филиалы ресторанов
      },
      {
        path: "branches-with-tables/:restaurantId/branch/tables/:branchId",
        element: <TableList />,
      },
      {
        path: "branch/tables/:branchId/reservation/:tableId",
        element: <ReservationForm />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
);
