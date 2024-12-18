import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HOST } from "../../constants";
import styles from "../Restaurants/Restaurants.module.css";
import { ShoppingBag, Calendar, DollarSign } from "lucide-react"; // Импорт иконок

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
    <div className={styles["content"]}>
      <div>
        <h2>Рестораны с самовывозом</h2>
        <input
          className={styles["input"]}
          value={searchText}
          onChange={handleSearchInput} // Поиск с задержкой
          placeholder="Поиск ресторанов"
        />
        {restaurants.map((restaurant) => (
          <div
            className={styles["card"]}
            key={restaurant.id}
            onClick={() =>
              navigate(`/${cityId}/menu/${restaurant.id}`, {
                state: {
                  imageUrl: restaurant.photo,
                  name: restaurant.name,
                  desc: restaurant.description,
                  id: restaurant.id,
                },
              })
            }
          >
            <div>
              <img
                src={restaurant.photo}
                alt="фото ресторана"
                className={styles["photo"]}
              />
            </div>
            <div style={{ marginLeft: 5 }}>
              <p className={styles["main-text"]}>{restaurant.name}</p>
              <p className={styles["desc-text"]}>{restaurant.description}</p>
              <div className={styles["icons-container"]}>
                {restaurant.pickup && (
                  <ShoppingBag
                    size={20}
                    color="#2ecc71" // Зеленый цвет для самовывоза
                  />
                )}
                {restaurant.booking && (
                  <Calendar
                    size={20}
                    color="#2ecc71" // Зеленый цвет для брони
                  />
                )}
                {restaurant.isPaidDelivery && (
                  <DollarSign
                    size={20}
                    color="#ffcc00" // Желтый цвет для платной доставки
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
