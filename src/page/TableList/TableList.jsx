import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TableList.module.css";
import { HOST } from "../../constants";
import { useLocation } from "react-router-dom";

export default function TableList() {
  const [tables, setTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { branchId } = useParams();
  const { cityId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const openingTime = queryParams.get("openingTime");
  const closingTime = queryParams.get("closingTime");
  const fetchTables = async (date) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${HOST}/branches/${branchId}/tables?date=${date}`
      );
      if (response.data.isSuccess) {
        setTables(response.data.value);
      } else {
        console.error("Ошибка при загрузке столиков:", response.data.error);
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTables(selectedDate);
    }
  }, [branchId, selectedDate]);

  const handleTableClick = (tableId) => {
    if (!selectedDate) {
      alert("Пожалуйста, выберите дату бронирования!");
      return;
    }
    // Передаем выбранную дату на страницу бронирования через параметры маршрута
    navigate(
      `/${cityId}/branch/tables/${branchId}/reservation/${tableId}?date=${selectedDate}&openingTime=${openingTime}&closingTime=${closingTime}`
    );
  };

  const handleDateChange = (event) => {
    const selected = event.target.value;
    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);

    if (selected < today) {
      alert("Вы не можете выбрать прошедшую дату!");
      return;
    }

    if (selected > maxDate.toISOString().split("T")[0]) {
      alert("Вы не можете выбрать дату более чем через 90 дней!");
      return;
    }

    setSelectedDate(selected);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Доступные столики</h2>
      <div className={styles.datePickerContainer}>
        <p>Выберите дату бронирования:</p>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className={styles.datePicker}
        />
      </div>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className={styles.tableList}>
          {tables.map((table) => (
            <div
              className={styles.card}
              key={table.id}
              onClick={() => handleTableClick(table.id)}
            >
              <h3 className={styles.tableNumber}>Столик №{table.number}</h3>
              <p className={styles.info}>Количество мест: {table.seats}</p>
              <p className={styles.info}>Расположение: {table.location}</p>
              {table.type && <p className={styles.info}>Тип: {table.type}</p>}
              {table.features && (
                <p className={styles.info}>Особенности: {table.features}</p>
              )}
              <p className={styles.info}>
                Минимальный заказ:{" "}
                {table.minimumOrder > 0 ? `${table.minimumOrder}₸` : "Нет"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
