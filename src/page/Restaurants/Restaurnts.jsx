import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HOST } from "../../constants";
import styles from "./Restaurants.module.css";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";

export default function Restaurnts() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const { cityId } = useParams();
  const dispatch = useDispatch();

  const getRestaurantsById = async (id) => {
    const result = await axios.get(`${HOST}/restaurant/all/${id}`);
    console.log(result.data);
    setRestaurants(result.data.value);
  };

  useEffect(() => {
    getRestaurantsById(cityId);
    dispatch(cartActions.clean())
  }, []);
  return (
    <div className={styles["content"]}>
      <div>
        <h2>Рестораны</h2>
        {restaurants.map((restaurant) => (
          <div
            className={styles["card"]}
            key={restaurant.id}
            onClick={() =>
              navigate(`/menu/${restaurant.id}`, {
                state: {
                  imageUrl: restaurant.photo,
                  name: restaurant.name,
                  desc: restaurant.description,
                  id:restaurant.id
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
