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

const router = createBrowserRouter([
  {
    path: "/",
    element: <SelectCity />,
  },
  {
    path: "/restaurant/:cityId",
    element: <Restaurnts />,
  },
  {
    path: "/menu/:restaurantId",
    element: <Menu />,
  },
  {
    path: "/order",
    element: <Order />,
  }
  ,
  {
    path: "/branch/:restaurantId",
    element: <Branch />,
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
);
