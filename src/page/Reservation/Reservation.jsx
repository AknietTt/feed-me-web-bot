import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Reservation.module.css";
import { HOST } from "../../constants";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";

export default function Reservation() {
  const [restaurants, setRestaurants] = useState([]);
  const { cityId } = useParams();
  const navigate = useNavigate();

  const fetchRestaurantsWithBooking = async () => {
    try {
      const response = await axios.get(`${HOST}/restaurants/${cityId}/booking`);
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
    navigate(`/feed-me/${cityId}/branches-with-tables/${restaurantId}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Рестораны для бронирования</h2>
      <div className={styles.restaurantList}>
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => handleRestaurantClick(restaurant.id)}
          />
        ))}
      </div>
    </div>
  );
}
