import { useEffect, useState } from "react";
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

export default function Menu() {
  const [foods, setFood] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { cityId } = useParams();

  const location = useLocation();
  const { imageUrl } = location.state;
  const { name } = location.state;
  const { desc } = location.state;
  const { id } = location.state;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartTotal = cart.items.reduce(
    (total, item) => total + item.food.price * item.count,
    0
  );

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

  const handleClearCartModal = ()=>{
    dispatch(cartActions.clean())
  }

  useEffect(() => {
    getFoods();
  }, []);

  return (
    <div className="main">
      <Haeder photo={imageUrl} name={name} desc={desc} />
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
              {`Корзина (Олпатить) ${cartTotal} ₸`}
            </Button>
          )}{" "}
        </div>
      </div>
      <CartModal isOpen={isCartModalOpen} onClose={handleCloseCartModal} onClear={handleClearCartModal} restaurantId={id} cityId={cityId} />
      <div style={{ margin: "150px" }}></div>
    </div>
  );
}
