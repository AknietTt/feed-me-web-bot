import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HOST } from "../../constants";
import styles from "./Restaurants.module.css";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState(""); // Для хранения текста поиска
  const [debounceTimer, setDebounceTimer] = useState(null); // Для управления таймером задержки
  const navigate = useNavigate();
  const { cityId } = useParams();
  const dispatch = useDispatch();

  const getRestaurantsById = async (id) => {
    const result = await axios.get(`${HOST}/restaurant/all/${id}`);
    setRestaurants(result.data.value);
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
        getRestaurantsById(cityId); // Если поле пустое, загружаем все рестораны
      }
    }, 2000);

    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    getRestaurantsById(cityId);
    dispatch(cartActions.clean());
  }, [cityId, dispatch]);

  return (
    <div className={styles["content"]}>
      <div>
        <h2>Рестораны</h2>
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
                  id: restaurant.id
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
