import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./ReservationForm.module.css"; // Импорт стилей
import { HOST } from "../../constants";

export default function ReservationForm() {
  const { tableId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get("date");
  const openingTime = queryParams.get("openingTime");
  const closingTime = queryParams.get("closingTime");

  const [formData, setFormData] = useState({
    reservationDate: selectedDate || "",
    reservationTime: "",
    numberOfGuests: 1,
    userName: "",
    phoneNumber: "",
    telegramChatId: null,
    telegramUserId: null,
  });

  useEffect(() => {
    if (!selectedDate) {
      alert(
        "Дата бронирования отсутствует! Пожалуйста, вернитесь и выберите дату."
      );
      navigate(-1);
    }
  }, [selectedDate, navigate]);

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "reservationTime") {
      const reservationMinutes = timeToMinutes(value);
      const openingMinutes = timeToMinutes(openingTime);
      const closingMinutes = timeToMinutes(closingTime);
  
      // Проверяем переход через полночь
      const isValidTime =
        (openingMinutes <= closingMinutes && reservationMinutes >= openingMinutes && reservationMinutes <= closingMinutes) || // Один и тот же день
        (openingMinutes > closingMinutes && // Переход через полночь
          (reservationMinutes >= openingMinutes || reservationMinutes <= closingMinutes));
  
      if (!isValidTime) {
        alert(
          `Время бронирования должно быть между ${openingTime} и ${closingTime}`
        );
        return;
      }
    }
  
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        reservationTime: `${formData.reservationTime}:00`,
        tableId,
      };
      const response = await axios.post(`${HOST}/reservations`, payload);
      if (response.data.isSuccess) {
        alert("Бронь успешно оформлена!");
        navigate("/feed-me/");
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
            readOnly
            className={styles.readOnlyInput}
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
  