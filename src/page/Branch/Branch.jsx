import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Branch.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { HOST } from "../../constants";

export default function Branch() {
  const { restaurantId } = useParams();
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate(); // Хук для программной навигации

  // Запрос для получения филиалов ресторана по restaurantId
  const getBranchesByRestaurantId = async (id) => {
    try {
      const response = await axios.get(HOST + `/branch/restaurant/${id}`);
      if (response.data.isSuccess) {
        setBranches(response.data.value);
      } else {
        console.error("Ошибка:", response.data.error);
      }
    } catch (error) {
      console.error("Ошибка при запросе филиалов:", error);
    }
  };

  useEffect(() => {
    getBranchesByRestaurantId(restaurantId);
  }, [restaurantId]);

  // Функция для перехода на страницу заказа
  const handleOrder = (branchId) => {
    navigate(`/order`, { state: { branchId } }); // Передаем id филиала через state
  };

  return (
    <div className={styles["branch-container"]}>
      <h2>Выберите филиал для заказа</h2>
      <div className={styles["branch-list"]}>
        {branches.map((branch) => (
          <div className={styles["branch-card"]} key={branch.id}>
            <h3>{branch.restaurant}</h3>
            <p>Город: {branch.city}</p>
            <p>Адрес: {branch.address}</p>
            <button
              className={styles["order-button"]}
              onClick={() => handleOrder(branch.id)} // Вызываем функцию с id филиала
            >
              Заказать из этого филиала
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
