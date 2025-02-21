import React, { useEffect, useState, useRef, useCallback } from "react";
import Haeder from "../../components/Header/Haeder";
import { useParams, useLocation } from "react-router-dom";
import FoodCard from "../../components/FoodCard/FoodCard";
import axios from "axios";
import { HOST } from "../../constants";
import styles from "./Menu.module.css";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/cartSlice";
import Button from "../../components/Button/Button";
import CartModal from "../../components/CartModal/CartModal";
import FoodModal from "../../components/FoodModal/FoodModal";
import BackButton from "../../components/BackButton/BackButton";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRefs = useRef({});
  const observer = useRef();
  const { cityId } = useParams();
  const location = useLocation();
  const { imageUrl, name, desc, id, rating } = location.state;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartTotal = cart.items.reduce(
    (total, item) => total + item.food.price * item.count,
    0
  );

  const fetchFoods = async (currentPage) => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    try {
      const res = await axios.get(
        `${HOST}/menus/foods?restaurantId=${id}&page=${currentPage}&pageSize=10`
      );

      if (Array.isArray(res.data.value) && res.data.value.length > 0) {
        setFoods((prev) => [...prev, ...res.data.value]); // Добавляем новые данные
        setPage(currentPage + 1);
        setHasMore(res.data.value.length === 10); // Если пришло меньше 10 — конец
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка загрузки меню:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFoods(page);
  }, [id]);

  const lastFoodElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchFoods(page);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page]
  );

  return (
    <div className="main">
      <Haeder photo={imageUrl} name={name} desc={desc} reting={rating} />
      <BackButton />

      <div className={styles.categoryListContainer}>
        <div className={styles.categoryList}>
          {foods.map((category) => (
            <button key={category.categoryName} className={styles.categoryItem}>
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: 10 }}>
        {foods.length > 0 ? (
          foods.map((category, catIndex) => (
            <div key={category.categoryName}>
              <h2 className={styles.categoryTitle}>{category.categoryName}</h2>
              <div className={styles.foodCardContainer}>
                {category.foods.map((food, foodIndex) => {
                  const isLastElement =
                    catIndex === foods.length - 1 &&
                    foodIndex === category.foods.length - 1;

                  return (
                    <FoodCard
                      ref={isLastElement ? lastFoodElementRef : null}
                      id={food.id}
                      key={food.id}
                      photo={food.photo}
                      name={food.name}
                      price={food.price}
                      desc={food.description || "Описание недоступно"} // Предотвращаем null
                      addToCart={() => dispatch(cartActions.add(food))}
                      onClick={() => setSelectedFood(food)}
                    />
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>Меню пока недоступно</p>
        )}

        {loading && <p>Загрузка...</p>}

        <div className={styles.fixedButtonContainer}>
          {cart.items.length > 0 && (
            <Button
              className={styles.fixedButton}
              onClick={() => setIsCartModalOpen(true)}
            >
              {`${cartTotal} ₸`}
            </Button>
          )}
        </div>
      </div>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onClear={() => dispatch(cartActions.clean())}
        restaurantId={id}
        cityId={cityId}
      />

      <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />
    </div>
  );
}
