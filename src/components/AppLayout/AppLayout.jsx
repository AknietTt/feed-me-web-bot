import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../BottomNavigation/BottomNavigation";

const AppLayout = () => {
  const location = useLocation();

  // Страницы без Bottom Navigation
  const noNavRoutes = ["/", "/done"];

  return (
    <div>
      {/* Основной контент */}
      <Outlet />

      {/* Bottom Navigation отображается, если текущий путь не входит в noNavRoutes */}
      {!noNavRoutes.includes(location.pathname) && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
