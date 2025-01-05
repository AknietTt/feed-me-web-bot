import React, { useEffect, useState } from "react";
import Haeder from "../../components/Header/Haeder";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FoodCard from "../../components/FoodCard/FoodCard";
import axios from "axios";
import { HOST } from "../../constants";
import styles from "./Menu.module.css";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import Button from "../../components/Button/Button";
import CartModal from "../../components/CartModal/CartModal";
import FoodModal from "../../components/FoodModal/FoodModal";

export default function Menu() {
  const [foods, setFood] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { cityId } = useParams();
  const location = useLocation();
  const { imageUrl, name, desc, id , rating} = location.state;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartTotal = cart.items.reduce(
    (total, item) => total + item.food.price * item.count,
    0
  );
  const [selectedFood, setSelectedFood] = useState(null);

  const getFoods = async () => {
    const res = await axios.get(`${HOST}/menus/foods?restaurantId=${id}`);
    setFood(res.data.value);
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

  const handleFoodClick = (food) => {    
    setSelectedFood(food); // Устанавливает выбранную еду
  };
  
  useEffect(() => {
    getFoods();
  }, []);

  return (
    <div className="main">
      <Haeder photo={imageUrl} name={name} desc={desc} reting={rating}/>
      <div style={{ margin: 10 }}>
        {foods.map((category) => (
          <div key={category.categoryName}>
            <h2 className={styles.categoryTitle}>{category.categoryName}</h2>
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
                  onClick={() => handleFoodClick(food)}
                />
              ))}
            </div>
          </div>
        ))}
        <div className={styles.fixedButtonContainer}>
          {cart.items.length > 0 && (
            <Button
              className={styles.fixedButton}
              onClick={handleCartButtonClick}
            >
              {`${cartTotal} ₸`}
            </Button>
          )}
        </div>
      </div>
      <CartModal
        isOpen={isCartModalOpen}
        onClose={handleCloseCartModal}
        onClear={handleClearCartModal}
        restaurantId={id}
        cityId={cityId}
      />
      <FoodModal
      food={selectedFood}
      onClose={() => setSelectedFood(null)} // Закрыть модальное окно
    />

      <div style={{ margin: "150px" }}></div>
    </div>
  );
}
