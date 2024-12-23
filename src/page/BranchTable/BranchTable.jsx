import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./BranchTable.module.css";
import { FaMapMarkerAlt, FaClock, FaTruck } from "react-icons/fa"; // Добавлены иконки
import { HOST } from "../../constants";

export default function BranchTable() {
  const [branches, setBranches] = useState([]);
  const { cityId, restaurantId } = useParams();
  const navigate = useNavigate();

  const fetchBranchesWithTables = async () => {
    try {
      const response = await axios.get(
        `${HOST}/branches/tables/${restaurantId}/cities/${cityId}`
      );
      if (response.data.isSuccess) {
        setBranches(response.data.value);
      } else {
        console.error("Ошибка при загрузке филиалов:", response.data.error);
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  useEffect(() => {
    fetchBranchesWithTables();
  }, [cityId, restaurantId]);

  const handleBranchClick = (branchId, openingTime, closingTime) => {
    navigate(
      `branch/tables/${branchId}?openingTime=${openingTime}&closingTime=${closingTime}`
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Филиалы ресторана</h2>
      <div className={styles.branchList}>
        {branches.map((branch) => (
          <div
            className={styles.card}
            key={branch.id}
            onClick={() =>
              handleBranchClick(branch.id, branch.openingTime, branch.closingTime)
            }
          >
            <FaMapMarkerAlt className={styles.icon} />
            <h3 className={styles.branchName}>{branch.restaurant}</h3>
            <p className={styles.address}>Адрес: {branch.address}</p>
            <p className={styles.city}>Город: {branch.city.name}</p>
            <p className={styles.info}>
              Доставка: {branch.delivery ? "Да" : "Нет"}, Самовывоз:{" "}
              {branch.pickup ? "Да" : "Нет"}
            </p>
            <p className={styles.hours}>
              <FaClock /> Время работы: {branch.openingTime} - {branch.closingTime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
