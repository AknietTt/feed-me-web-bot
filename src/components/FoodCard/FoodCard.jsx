import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./FoodCard.module.css";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";

export default function FoodCard({ id, photo, name, price, desc }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addToCart = () => {
    dispatch(cartActions.add({ id, photo, name, price, desc }));
  };

  return (
    <div className={styles.card}>
      <img src={photo} className={styles.image} alt={name} />
      <div className={styles.details}>
        <div>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.description}>{desc}</p>
          <p className={styles.price}>{price} ₸</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.addButton} onClick={addToCart}>
            <div className={styles.addIcon}>
            +
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
