import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Добавляем useNavigate
import styles from "./TableList.module.css"; // Импорт стилей
import { HOST } from "../../constants";

export default function TableList() {
  const [tables, setTables] = useState([]);
  const { branchId } = useParams(); // Получаем параметры маршрута
  const { cityId } = useParams(); // Получаем параметры маршрута
  const navigate = useNavigate(); // Хук для навигации

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${HOST}/branch/tables/${branchId}`);
      if (response.data.isSuccess) {
        setTables(response.data.value);
      } else {
        console.error("Ошибка при загрузке столиков:", response.data.error);
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [branchId]);

  const handleTableClick = (tableId) => {
    navigate(`/${cityId}/branch/tables/${branchId}/reservation/${tableId}`); // Переход на страницу бронирования
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Доступные столики</h2>
      <div className={styles.tableList}>
        {tables.map((table) => (
          <div
            className={styles.card}
            key={table.id}
            onClick={() => handleTableClick(table.id)} // Обработчик клика
          >
            <h3 className={styles.tableNumber}>Столик №{table.number}</h3>
            <p className={styles.info}>Количество мест: {table.seats}</p>
            <p className={styles.info}>Расположение: {table.location}</p>
            {table.type && <p className={styles.info}>Тип: {table.type}</p>}
            {table.features && (
              <p className={styles.info}>Особенности: {table.features}</p>
            )}
            <p className={styles.info}>
              Минимальный заказ: {table.minimumOrder > 0 ? `${table.minimumOrder}₸` : "Нет"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
