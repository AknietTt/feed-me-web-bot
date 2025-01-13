import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TableList.module.css";
import { HOST } from "../../constants";
import { useLocation } from "react-router-dom";
import { User, MapPin, Tag } from "lucide-react"; // Import icons from lucide-react
import { Carousel } from "antd"; // Ant Design Carousel

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
    navigate(
      `/feed-me/${cityId}/branch/tables/${branchId}/reservation/${tableId}?date=${selectedDate}&openingTime=${openingTime}&closingTime=${closingTime}`
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
      <h2 className={styles.title}>Бронирование стола</h2>
      <div className={styles.datePickerContainer}>
        <p>Выберите удобную дату:</p>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className={styles.datePicker}
        />
      </div>
      {loading ? (
        <p>Загрузка столиков...</p>
      ) : (
        <div className={styles.tableList}>
          {tables.map((table) => (
            <div
              className={styles.card}
              key={table.id}
              onClick={() => handleTableClick(table.id)}
            >
              <h3 className={styles.tableNumber}>Столик №{table.number}</h3>
              {table.imageUrls && table.imageUrls.length > 0 && (
                <Carousel autoplay className={styles.carousel}>
                  {table.imageUrls.map((url, index) => (
                    <div key={index}>
                      <img
                        src={url}
                        alt={`Фото столика ${table.number}`}
                        className={styles.carouselImage}
                      />
                    </div>
                  ))}
                </Carousel>
              )}
              <div className={styles.iconRow}>
                <div className={styles.iconContainer}>
                  <User size={20} className={styles.icon} />
                  <span>{table.seats}</span>
                </div>
                <div className={styles.iconContainer}>
                  <MapPin size={20} className={styles.icon} />
                  <span>{table.location}</span>
                </div>
              </div>
              <div className={styles.iconContainer}>
                <Tag size={20} className={styles.icon} />
                <span>{table.type}</span>
              </div>
              {table.features && (
                <div className={styles.features}>
                  <ul>
                    {table.features.split(",").map((feature, index) => (
                      <li key={index}>{feature.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className={styles.info}>
                Минимальный заказ:{" "}
                {table.minimumOrder > 0 ? `${table.minimumOrder}₸` : "Нет"}
              </p>
              
              <div className={styles.buttonContainer}>
                <button className={styles.bookButton}>Выбрать стол</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
