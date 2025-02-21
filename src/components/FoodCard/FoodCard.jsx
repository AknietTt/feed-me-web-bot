import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import styles from "./FoodCard.module.css";

export default function FoodCard({ id, photo, name, price, desc, onClick }) {
  const dispatch = useDispatch();

  const addToCart = (event) => {
    event.stopPropagation(); // Предотвращаем всплытие события
    dispatch(cartActions.add({ id, photo, name, price, desc }));
  };

  // Функция для сокращения описания
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <img
        src={
          photo ||
          "https://cdn1.iconfinder.com/data/icons/food-line-19/48/Salad-1024.png"
        }
        className={styles.image}
        alt={name}
        onError={(e) => {
          e.target.onerror = null; // Чтобы не зацикливалось
          e.target.src =
            "https://cdn1.iconfinder.com/data/icons/food-line-19/48/Salad-1024.png";
        }}
      />{" "}
      <div className={styles.details}>
        <div>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.description}>{truncateText(desc, 60)}</p>
          <p className={styles.price}>{price} ₸</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.addButton} onClick={addToCart}>
            <div className={styles.addIcon}>+</div>
          </button>
        </div>
      </div>
    </div>
  );
}
