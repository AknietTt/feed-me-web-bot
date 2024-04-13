import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./FoodCard.module.css";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";

export default function FoodCard({id, photo, name, price, desc }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartItem = cart.items.find(item => item.food.id === id);

  const addToCart = () => {
    dispatch(cartActions.add({ id, photo, name, price, desc }));
  };

  const increaseQuantity = () => {
    dispatch(cartActions.add({id , photo , name , price , desc}));
  };

  const decreaseQuantity = () => {
    dispatch(cartActions.remove(id));
  };

  return (
    <div
      style={{
        backgroundColor: "#E4E2E2",
        borderRadius: 10,
      }}
    >
      <div style={{ padding: 10, margin: "0 auto" }}>
        <img src={photo} className={styles.image} alt={name} />
      </div>
      <div style={{ marginLeft: 10 }}>
        <p className={styles.text} style={{ margin: 0 }}>
          {price} ₸
        </p>
        <p className={styles.secondText}>{name} </p>
      </div>

      <div style={{ padding: 10}}>
        {cartItem ? (
          <div className={styles.quantityControl}>
            <button onClick={decreaseQuantity}>-</button>
            <span>{cartItem.count}</span>
            <button onClick={increaseQuantity}>+</button>
          </div>
        ) : (
          <button className={styles.button} onClick={addToCart}>
            <FaPlus style={{ paddingTop: 2, paddingRight: 10 }} />
            <span>{"Добавить"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
