import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Done.module.css";

export default function Done() {
  const navigate = useNavigate();

  // Очистить историю роутинга
  useEffect(() => {
    window.history.replaceState(null, null, '/done');
  }, []);

  const handleGoBack = () => {
    navigate('/feed-me/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <div className={styles.checkmarkContainer}>
          <div className={styles.checkmark}></div>
        </div>
        <h1>Спасибо за покупку!</h1>
        <p>Ваш заказ был успешно оформлен.</p>
        <button className={styles.backButton} onClick={handleGoBack}>Вернуться на главную</button>
      </div>
    </div>
  );
}
