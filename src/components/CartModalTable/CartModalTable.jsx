import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import styles from "./CartModalTable.module.css";
import Button from "../Button/Button";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CartModalTable = ({ isOpen, onClose, onClear, restaurantId, tableId , tableNumber }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartTotal = cart.items.reduce(
    (total, item) => total + item.food.price * item.count,
    0
  );

  const handleIncreaseQuantity = (food) => {
    dispatch(cartActions.add(food));
  };

  const handleDecreaseQuantity = (itemId) => {
    dispatch(cartActions.remove(itemId));
  };

  return (
    <div className={isOpen ? styles.modalContainer : styles.hidden}>
      <div className={styles.modalContent}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className={styles.close} onClick={onClose}>
            <IoClose size={25} />
          </span>
          <span className={styles.close} onClick={onClear}>
            <MdDelete size={25} />
          </span>
        </div>

        <h2>Заказ на столик</h2>
        <p>Номер столика: {tableNumber}</p>

        {cart.items.map((item) => (
          <div key={item.food.id} className={styles.itemContainer}>
            <img
              src={item.food.photo}
              alt={item.food.name}
              className={styles.foodImage}
            />
            <div className={styles.itemInfo}>
              <p style={{ margin: 0 }} className={styles.foodName}>
                {item.food.name}
              </p>
              <p>
                {item.food.price}₸
                <span style={{ marginLeft: 10, marginRight: 10 }}> x </span>
                {item.count}
              </p>
              <div className={styles.quantityControl}>
                <button onClick={() => handleDecreaseQuantity(item.food.id)}>
                  -
                </button>
                <span>{item.count}</span>
                <button onClick={() => handleIncreaseQuantity(item.food)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        <div style={{ paddingBottom: "200px" }}></div>
        <Button
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            width: "90%",
            height: "50px",
            transform: "translateX(-50%)",
          }}
          disabled={cart.items.length === 0}
          onClick={() => {
            navigate(`/restaurant/${restaurantId}/table/${tableId}/order`);
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: "50%" }}>Оформить заказ</span>
            <span>{`${cartTotal}₸`}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default CartModalTable;
