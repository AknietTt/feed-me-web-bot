import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import FoodCard from "../../components/FoodCard/FoodCard";
import Button from "../../components/Button/Button";
import CartModalTable from "../../components/CartModalTable/CartModalTable";
import styles from "./QRMenu.module.css";
import { HOST } from "../../constants";

const QRMenu = () => {
  const [foods, setFoods] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("tableId");
  const tableNumber = searchParams.get("tableNumber");
  const branchId = searchParams.get("branchId");
  const restaurantId = searchParams.get("restaurantId");

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartTotal = cart.items.reduce(
    (total, item) => total + item.food.price * item.count,
    0
  );

  const getFoods = async () => {
    try {
      const res = await axios.get(`${HOST}/menu/food?restaurnatId=${restaurantId}`);
      console.log(res);
      
      setFoods(res.data.value);
    } catch (error) {
      console.error("Ошибка загрузки меню:", error);
    }
  };

  const addToCart = (food) => {
    dispatch(cartActions.add(food));
  };

  const handleCartButtonClick = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  const handleClearCartModal = () => {
    dispatch(cartActions.clean());
  };

  useEffect(() => {
    getFoods();
  }, [restaurantId, branchId]);

  return (
    <div className="main">
      <h1>QR Меню</h1>
      <p>Номер столика: {tableNumber}</p>
      <div style={{ margin: 10 }}>
        {foods.map((category) => (
          <div key={category.categoryName}>
            <h2>{category.categoryName}</h2>
            <div className={styles.foodCardContainer}>
              {category.foods.map((food) => (
                <FoodCard
                  id={food.id}
                  key={food.id}
                  photo={food.photo}
                  name={food.name}
                  price={food.price}
                  desc={food.description}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        ))}
        <div className={styles.fixedButtonContainer}>
          {cart.items.length > 0 && (
            <Button
              style={{ width: "100%", marginLeft: "5px", marginRight: "5px" }}
              onClick={handleCartButtonClick}
            >
              {`Корзина (Оформить заказ) ${cartTotal} ₸`}
            </Button>
          )}
        </div>
      </div>
      <CartModalTable
        isOpen={isCartModalOpen}
        onClose={handleCloseCartModal}
        onClear={handleClearCartModal}
        restaurantId={restaurantId}
        tableNumber={tableNumber}
        tableId={tableId}
      />
      <div style={{ margin: "150px" }}></div>
    </div>
  );
};

export default QRMenu;
