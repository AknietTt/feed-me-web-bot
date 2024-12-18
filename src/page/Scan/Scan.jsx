import React, { useRef, useEffect } from "react";

export default function Scan() {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Храним ссылку на видеопоток

  useEffect(() => {
    // Проверка поддержки API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } }) // Задняя камера
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream; // Сохраняем поток для последующей остановки
          }
        })
        .catch((error) => {
          console.error("Ошибка доступа к камере:", error);
        });
    } else {
      console.error("getUserMedia API не поддерживается этим браузером.");
    }

    // Cleanup function для остановки видеопотока при размонтировании компонента
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop()); // Останавливаем все треки потока
      }
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#333", marginBottom: "20px", fontSize: "2rem" }}>
        📷 Откройте камеру для сканирования
      </h1>
      <p style={{ color: "#555", marginBottom: "10px" }}>
        Наведите камеру на нужный объект или QR-код.
      </p>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "500px",
          border: "3px solid #4CAF50",
          borderRadius: "10px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
        autoPlay
      />
      <p style={{ color: "#777", marginTop: "10px", fontSize: "0.9rem" }}>
        Камера активируется автоматически. Убедитесь, что браузер имеет доступ к камере.
      </p>
    </div>
  );
}
