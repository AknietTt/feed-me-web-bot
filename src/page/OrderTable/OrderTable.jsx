import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './OrderTable.module.css';
import { useParams } from 'react-router-dom';

export default function OrderTable() {
  const [nameCustomer, setNameCustomer] = useState('');
  const [message, setMessage] = useState('');

  const cart = useSelector((state) => state.cart);
  const { tableId } = useParams(); // Получаем ID стола из маршрута
  const { tableNumber } = useParams(); // Получаем ID стола из маршрута

  const orderDetails = cart.items.map((item) => ({
    foodId: item.food.id,
    count: item.count,
  }));

  const summa = cart.items.reduce(
    (total, item) => total + item.food.price * item.count,
    0
  );

  const handleSubmit = async () => {
    const payload = {
      summa,
      nameCustomer,
      tableId,
      orderDetails,
    };

    try {
      const response = await axios.post('https://localhost:7284/order-table/create', payload);
      setMessage('Заказ успешно создан!');
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
      setMessage('Ошибка при создании заказа.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Создать заказ</h1>
      <div className={styles.formGroup}>
        <label>Имя клиента:</label>
        <input
          type="text"
          value={nameCustomer}
          onChange={(e) => setNameCustomer(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.orderSummary}>
        <h2>Сумма заказа: {summa}₸</h2>
      </div>
      <div className={styles.foodList}>
        <h2>Список выбранных блюд:</h2>
        <ul>
          {cart.items.map((item) => (
            <li key={item.food.id} className={styles.foodItem}>
              {item.food.name} - {item.count} x {item.food.price}₸
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSubmit} className={styles.submitButton}>
        Создать заказ
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
