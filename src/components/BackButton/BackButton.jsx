import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: "fixed",
        top: "15px",
        left: "15px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.2)", // Стеклянный эффект
        backdropFilter: "blur(10px)", // Размытие
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <span
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#fff",
          textShadow: "0px 0px 3px black, 0px 0px 3px black", // Черные тонкие контуры
        }}
      >
        ←
      </span>
    </button>
  );
};

export default BackButton;
