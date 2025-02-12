import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Branch.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { HOST } from "../../constants";
import BackButton from "../../components/BackButton/BackButton";

export default function Branch() {
  const { restaurantId } = useParams();
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate(); // Хук для программной навигации
  const { cityId } = useParams();

  // Запрос для получения филиалов ресторана по restaurantId
  const getBranchesByRestaurantId = async (id) => {
    try {
      const response = await axios.get(
        HOST + `/restaurants/${id}/cities/${cityId}/branches`
      );
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
  const handleOrder = (branchId, type , deliverySumm) => {
    navigate(`/feed-me/${cityId}/order`, { state: { branchId, orderType: type, deliverySumm} }); // Передаем id филиала и тип заказа через state
  };

  return (
    <div className={styles["branch-container"]}>
      <div >

      <BackButton />
      </div>

      <h2 style={{paddingTop:50}}>Выберите филиал и способ заказа</h2>
      <div className={styles["branch-list"]}>
        {branches.map((branch) => (
          <div className={styles["branch-card"]} key={branch.id}>
            <h3>{branch.restaurant}</h3>
            <p>Город: {branch.city.name}</p>
            <p>Адрес: {branch.address}</p>
            <p>
              Стоимость доставки:{" "}
              {branch.paidDelivery > 0 ? `${branch.paidDelivery} тг` : "Бесплатно"}
            </p>
            <div className={styles["order-buttons"]}>
              {branch.pickup && (
                <button
                  className={styles["pickup-button"]}
                  onClick={() => handleOrder(branch.id, "pickup",0 )}
                >
                  Самовывоз
                </button>
              )}
              {branch.delivery && (
                <button
                  className={styles["delivery-button"]}
                  onClick={() => handleOrder(branch.id, "delivery" , branch.paidDelivery)}
                >
                  Доставка
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
