import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HOST } from "../../constants";
import styles from "../Restaurants/Restaurants.module.css";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";

export default function Pickup() {
  const [restaurants, setRestaurants] = useState([]); // Состояние для ресторанов
  const [searchText, setSearchText] = useState(""); // Для хранения текста поиска
  const [debounceTimer, setDebounceTimer] = useState(null); // Таймер для дебаунса
  const { cityId } = useParams();
  const navigate = useNavigate();

  // Функция для получения ресторанов с самовывозом
  const getRestaurantsWithPickup = async (id) => {
    try {
      const response = await axios.get(`${HOST}/restaurants/${id}/pickup`);
      if (response.data.isSuccess) {
        setRestaurants(response.data.value);
      } else {
        console.error("Ошибка при загрузке ресторанов:", response.data.error);
      }
    } catch (error) {
      console.error("Ошибка при запросе ресторанов:", error);
    }
  };

  // Функция для поиска ресторанов
  const searchRestaurants = async (query) => {
    try {
      const response = await axios.get(
        `${HOST}/restaurant/search/${encodeURIComponent(query)}`
      );
      setRestaurants(response.data.value); // Обновляем состояние с результатами поиска
    } catch (error) {
      console.error("Ошибка при поиске ресторанов:", error);
    }
  };

  // Обработчик ввода с debounce
  const handleSearchInput = (e) => {
    const text = e.target.value;
    setSearchText(text);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      if (text.trim()) {
        searchRestaurants(text); // Выполняем поиск
      } else {
        getRestaurantsWithPickup(cityId); // Загружаем рестораны с самовывозом, если поле пустое
      }
    }, 2000); // 2 секунды задержка

    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    getRestaurantsWithPickup(cityId);
  }, [cityId]);

  return (
    <div className={styles.content}>
      <div>
        <h2>Рестораны с самовывозом</h2>
        <input
          className={styles.input}
          value={searchText}
          onChange={handleSearchInput} // Поиск с задержкой
          placeholder="Поиск ресторанов"
        />
        <div className={styles.gridContainer}>
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`${styles.restaurantCard} ${
                !restaurant.isOpen ? styles.disabledCard : ""
              }`}
              onClick={() => {
                if (restaurant.isOpen) {
                  navigate(`/feed-me/${cityId}/menu/${restaurant.id}`, {
                    state: {
                      imageUrl: restaurant.photo,
                      name: restaurant.name,
                      desc: restaurant.description,
                      id: restaurant.id,
                    },
                  });
                }
              }}
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
