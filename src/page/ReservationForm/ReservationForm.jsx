import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ReservationForm.module.css"; // Импорт стилей
import { HOST } from "../../constants";

export default function ReservationForm() {
  const { tableId } = useParams(); // Получаем tableId из маршрута
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    reservationDate: "",
    reservationTime: "",
    numberOfGuests: 1,
    userName: "",
    phoneNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, tableId }; // Добавляем tableId к данным формы
      const response = await axios.post(`${HOST}/reservations`, payload);
      if (response.data.isSuccess) {
        alert("Бронь успешно оформлена!");
        navigate("/"); // Переход на главный экран
      } else {
        alert("Ошибка при оформлении брони: " + response.data.error);
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error);
      alert("Не удалось оформить бронь. Попробуйте снова.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Оформление брони</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="reservationDate">Дата бронирования</label>
          <input
            type="date"
            id="reservationDate"
            name="reservationDate"
            value={formData.reservationDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reservationTime">Время бронирования</label>
          <input
            type="time"
            id="reservationTime"
            name="reservationTime"
            value={formData.reservationTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="numberOfGuests">Количество гостей</label>
          <input
            type="number"
            id="numberOfGuests"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="userName">Имя</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Номер телефона</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Оформить бронь
        </button>
      </form>
    </div>
  );
}
