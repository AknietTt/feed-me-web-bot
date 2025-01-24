// OnlineMenu.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./OnlineMenu.module.css";
import { HOST } from "../../constants";

const OnlineMenu = () => {
  const { restaurantId } = useParams();
  const [menu, setMenu] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `${HOST}/menus/foods?restaurantId=${restaurantId}`
        );
        if (response.data.isSuccess) {
          setMenu(response.data.value);
        }
      } catch (error) {
        console.error("Error fetching menu", error);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const handleCardClick = (food) => {
    setSelectedFood(food);
  };

  const closeModal = () => {
    setSelectedFood(null);
  };

  const scrollToCategory = (categoryName) => {
    if (categoryRefs.current[categoryName]) {
      categoryRefs.current[categoryName].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.menuContainer}>
      <div className={styles.categoryNav}>
        {menu.map((category) => (
          <button
            key={category.categoryName}
            className={styles.categoryButton}
            onClick={() => scrollToCategory(category.categoryName)}
          >
            {category.categoryName}
          </button>
        ))}
      </div>

      <div className={styles.categorySections}>
        {menu.map((category) => (
          <div
            key={category.categoryName}
            ref={(el) => (categoryRefs.current[category.categoryName] = el)}
            className={styles.categorySection}
          >
            <h2 className={styles.categoryTitle}>{category.categoryName}</h2>
            <div className={styles.foodList}>
              {category.foods.map((food) => (
                <div
                  key={food.id}
                  className={styles.foodCard}
                  onClick={() => handleCardClick(food)}
                >
                  <img
                    src={food.photo}
                    alt={food.name}
                    className={styles.foodImage}
                  />
                  <div className={styles.foodDetails}>
                    <h3 className={styles.foodName}>{food.name}</h3>
                    <p className={styles.foodDescription}>
                      {food.description.length > 50
                        ? `${food.description.slice(0, 50)}...`
                        : food.description}
                    </p>
                    <p className={styles.foodPrice}>{food.price} ₸</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedFood && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedFood.photo}
              alt={selectedFood.name}
              className={styles.modalImage}
            />
            <h3 className={styles.modalTitle}>{selectedFood.name}</h3>
            <p className={styles.modalDescription}>{selectedFood.description}</p>
            <p className={styles.modalPrice}>{selectedFood.price} ₸</p>
            <button className={styles.closeButton} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineMenu;
