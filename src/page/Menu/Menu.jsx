import React, { useEffect, useState, useRef } from "react";
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
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRefs = useRef({});
  const categoryListRef = useRef(null);
  const { cityId } = useParams();
  const location = useLocation();
  const { imageUrl, name, desc, id, rating } = location.state;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartTotal = cart.items.reduce(
    (total, item) => total + item.food.price * item.count,
    0
  );

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${HOST}/menus/foods?restaurantId=${id}`);
        setFoods(Array.isArray(res.data.value) ? res.data.value : []);
      } catch (error) {
        console.error("Ошибка загрузки меню:", error);
        setFoods([]); // В случае ошибки устанавливаем пустой массив
      }
    };
    fetchFoods();
  }, [id]);

  const scrollToCategory = (categoryName) => {
    const element = categoryRefs.current[categoryName];
    if (element) {
      const offset = 80; // Задаем отступ сверху (можно увеличить при необходимости)
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - offset, // Смещаем вверх на offset пикселей
        behavior: "smooth",
      });
    }
  };
  // Автоскролл списка категорий
  useEffect(() => {
    if (activeCategory && categoryListRef.current) {
      const activeElement = categoryListRef.current.querySelector(
        `[data-category="${activeCategory}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeCategory]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -90% 0px", // Проверяет, когда категория приближается к верху
      threshold: 0, // Срабатывает, когда категория пересекает границу
    };

    const observer = new IntersectionObserver((entries) => {
      let topCategory = null;
      let minTop = window.innerHeight; // Начинаем с большого значения

      entries.forEach((entry) => {
        const rect = entry.target.getBoundingClientRect();

        if (rect.top >= 0 && rect.top < minTop) {
          minTop = rect.top;
          topCategory = entry.target.dataset.category;
        }
      });

      if (topCategory) {
        setActiveCategory(topCategory);
      }
    }, observerOptions);

    Object.values(categoryRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [foods]);

  if (!foods || foods.length === 0) return <p>Загрузка меню...</p>;

  return (
    <div className="main">
      <Haeder photo={imageUrl} name={name} desc={desc} reting={rating} />
      <BackButton />

      {/* Фиксированный список категорий */}
      <div className={styles.categoryListContainer}>
        <div className={styles.categoryList} ref={categoryListRef}>
          {Array.isArray(foods) && foods.length > 0?(
            foods.map((category) => (
              <button
                key={category.categoryName}
                data-category={category.categoryName}
                className={`${styles.categoryItem} ${
                  activeCategory === category.categoryName ? styles.active : ""
                }`}
                onClick={() => scrollToCategory(category.categoryName)}
              >
                {category.categoryName}
              </button>
              ))
            ) : null}
        </div>
      </div>

      {/* Блок с блюдами */}
      <div style={{ margin: 10 }}>
        {foods.length > 0 ? (
          foods.map((category) => (
            <div
              key={category.categoryName}
              id={category.categoryName}
              data-category={category.categoryName}
              ref={(el) => (categoryRefs.current[category.categoryName] = el)}
            >
              <h2 className={styles.categoryTitle}>{category.categoryName}</h2>
              <div className={styles.foodCardContainer}>
              {Array.isArray(category.foods) && category.foods?.length > 0 ? (
                  category.foods.map((food) => (
                    <FoodCard
                      id={food.id}
                      key={food.id}
                      photo={food.photo}
                      name={food.name}
                      price={food.price}
                      desc={food.description}
                      addToCart={() => dispatch(cartActions.add(food))}
                      onClick={() => setSelectedFood(food)}
                    />
                  ))
                ) : (
                  <p>Нет доступных блюд</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Меню пока недоступно</p>
        )}

        {/* Кнопка корзины */}
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
      <div style={{ margin: "200px" }}></div>
    </div>
  );
}
