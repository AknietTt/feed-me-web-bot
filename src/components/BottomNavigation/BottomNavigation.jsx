import React, { useState } from "react";
import { Paper, Box } from "@mui/material";
import { Truck, ShoppingBag, Calendar, QrCode } from "lucide-react";

const BottomNavigation = () => {
  const [selected, setSelected] = useState("delivery");

  const buttons = [
    { id: "delivery", label: "Доставка", icon: Truck },
    { id: "pickup", label: "Самовывоз", icon: ShoppingBag },
    { id: "booking", label: "Бронировать", icon: Calendar },
    { id: "qrmenu", label: "QR-меню", icon: QrCode },
  ];

  const handleSelect = (id) => {
    setSelected(id);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 0",
        backgroundColor: "#ffffff",
        boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)",
      }}
      elevation={3}
    >
      {buttons.map(({ id, label, icon: Icon }) => (
        <Box
          key={id}
          onClick={() => handleSelect(id)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            color: selected === id ? "#FF4757" : "#A9A9A9",
          }}
        >
          <Icon size={24} />
          <span style={{ fontSize: "12px", marginTop: "4px" }}>{label}</span>
        </Box>
      ))}
    </Paper>
  );
};

export default BottomNavigation;
