import React from "react";
import styles from "./FoodModal.module.css";

export default function FoodModal({ food, onClose }) {
  if (!food) return null; // Если нет выбранного блюда, не рендерим модалку

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={food.photo} alt={food.name} className={styles.modalImage} />
        <h2 className={styles.modalTitle}>{food.name}</h2>
        <div className={styles.modalDescriptionContainer}>
          <p className={styles.modalDescription}>{food.description}</p>
        </div>
        <p className={styles.modalPrice}>{food.price} ₸</p>
        <button className={styles.closeButton} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
