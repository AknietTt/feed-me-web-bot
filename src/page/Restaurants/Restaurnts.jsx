import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { HOST } from "../../constants";
import styles from "./Restaurants.module.css";
import RestaurantCard from "../../components/RestaurantCard/RestaurantCard";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const { cityId } = useParams();
  const navigate = useNavigate();

  const getRestaurantsWithDelivery = async (id) => {
    try {
      const response = await axios.get(`${HOST}/restaurants/${id}/delivery`);
      if (response.data.isSuccess) {
        setRestaurants(
          response.data.value.map((restaurant) => ({
            ...restaurant          }))
        );
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
      setRestaurants(
        response.data.value.map((restaurant) => ({
          ...restaurant,
          rating: 10,
        }))
      );
    } catch (error) {
      console.error("Ошибка при поиске ресторанов:", error);
    }
  };

  const handleSearchInput = (e) => {
    const text = e.target.value;
    setSearchText(text);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      if (text.trim()) {
        searchRestaurants(text);
      } else {
        getRestaurantsWithDelivery(cityId);
      }
    }, 2000);

    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    getRestaurantsWithDelivery(cityId);
  }, [cityId]);

  return (
    <div className={styles.content}>
      <div>
        <h2>Рестораны с доставкой</h2>
        <input
          className={styles.input}
          value={searchText}
          onChange={handleSearchInput}
          placeholder="Поиск ресторанов"
        />
        <div className={styles.gridContainer}>
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() =>
                navigate(`/feed-me/${cityId}/menu/${restaurant.id}`, {
                  state: {
                    imageUrl: restaurant.photo,
                    name: restaurant.name,
                    desc: restaurant.description,
                    id: restaurant.id,
                    rating: restaurant.rating,
                  },
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
