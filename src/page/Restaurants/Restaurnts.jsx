import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HOST } from "../../constants";
import styles from "./Restaurants.module.css";
import { Truck, ShoppingBag, Calendar } from "lucide-react"; // Импорт иконок

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState(""); // Для хранения текста поиска
  const [debounceTimer, setDebounceTimer] = useState(null); // Для управления таймером задержки
  const { cityId } = useParams();
  const navigate = useNavigate();

  const getRestaurantsWithDelivery = async (id) => {
    try {
      const response = await axios.get(`${HOST}/restaurant/with-delivery/${id}`);
      if (response.data.isSuccess) {
        setRestaurants(response.data.value);
      } else {
        console.error("Ошибка при загрузке ресторанов:", response.data.error);
      }
    } catch (error) {
      console.error("Ошибка при запросе ресторанов:", error);
    }
  };

  const searchRestaurants = async (query) => {
    try {
      const response = await axios.get(`${HOST}/restaurant/search/${encodeURIComponent(query)}`);
      setRestaurants(response.data.value); // Обновляем рестораны с результатами поиска
    } catch (error) {
      console.error("Ошибка при поиске ресторанов:", error);
    }
  };

  const handleSearchInput = (e) => {
    const text = e.target.value;
    setSearchText(text);

    // Сбрасываем предыдущий таймер
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Устанавливаем новый таймер с задержкой 2 секунды
    const newTimer = setTimeout(() => {
      if (text.trim()) {
        searchRestaurants(text); // Выполняем запрос с текущим текстом поиска
      } else {
        getRestaurantsWithDelivery(cityId); // Если поле пустое, загружаем рестораны с доставкой
      }
    }, 2000);

    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    getRestaurantsWithDelivery(cityId);
  }, [cityId]);

  return (
    <div className={styles["content"]}>
      <div>
        <h2>Рестораны с доставкой</h2>
        <input
          className={styles["input"]}
          value={searchText}
          onChange={handleSearchInput} // Обновляем текст поиска с задержкой
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
                {restaurant.delivery && (
                  <Truck
                    size={20}
                    color="#2ecc71" // Зеленый цвет для доставки
                  />
                )}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
