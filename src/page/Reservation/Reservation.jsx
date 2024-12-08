import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Reservation.module.css"; // Импорт стилей
import { HOST } from "../../constants";

export default function Reservation() {
  const [restaurants, setRestaurants] = useState([]);
  const { cityId } = useParams(); // Получаем cityId из маршрута
  const navigate = useNavigate(); // Навигация для переходов

  const fetchRestaurantsWithBooking = async () => {
    try {
      const response = await axios.get(`${HOST}/restaurant/with-booking/${cityId}`);
      if (response.data.isSuccess) {
        setRestaurants(response.data.value);
      } else {
        console.error("Ошибка при загрузке ресторанов:", response.data.error);
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  useEffect(() => {
    fetchRestaurantsWithBooking();
  }, [cityId]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/${cityId}/branches-with-tables/${restaurantId}`); // Переход на страницу BranchTable
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Рестораны для бронирования</h2>
      <div className={styles.restaurantList}>
        {restaurants.map((restaurant) => (
          <div
            className={styles.card}
            key={restaurant.id}
            onClick={() => handleRestaurantClick(restaurant.id)} // Переход по клику
          >
            <img
              src={restaurant.photo}
              alt={restaurant.name}
              className={styles.image}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.restaurantName}>{restaurant.name}</h3>
              <p className={styles.description}>{restaurant.description}</p>
              {!restaurant.isOpen && (
                <p className={styles.closed}>Ресторан закрыт</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
