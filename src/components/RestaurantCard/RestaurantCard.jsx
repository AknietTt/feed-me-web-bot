import React from "react";
import { Truck, ShoppingBag, Calendar, Star } from "lucide-react";
import styles from "./RestaurantCard.module.css";

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img
          src={restaurant.photo}
          alt="фото ресторана"
          className={styles.photo}
        />
      </div>
      <div className={styles.details}>
        <div className={styles.header}>
          <p className={styles.mainText}>
            {restaurant.name}
            <span className={styles.rating}>
            ☆ {restaurant.rating || "N/A"}
            </span>
          </p>
        </div>
        <p className={styles.descText}>{restaurant.description}</p>
        <div className={styles.iconsContainer}>
          {restaurant.delivery && (
            <div className={styles.badge}>
              <Truck size={16} /> Доставка
            </div>
          )}
          {restaurant.pickup && (
            <div className={styles.badge}>
              <ShoppingBag size={16} /> Самовывоз
            </div>
          )}
          {restaurant.booking && (
            <div className={styles.badge}>
              <Calendar size={16} /> Бронь
            </div>
          )}
          {!restaurant.isOpen && (
            <p className={styles.closed}>Ресторан закрыт</p>
          )}
        </div>
      </div>
    </div>
  );
}
