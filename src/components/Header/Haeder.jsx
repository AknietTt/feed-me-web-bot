import React from "react";
import styles from "./Header.module.css";
import { FaStar } from "react-icons/fa";

export default function Header({ photo, name, desc, reting }) {
  return (
    <header className={styles.header}>
      <div className={styles.imageContainer}>
        <img src={photo} alt={name} className={styles.image} />
        <div className={styles.overlay}>
          <h2 className={styles.name}>
            {name}
            <div className={styles.rating}>
              <span>{reting}</span>
              <FaStar className={styles.starIcon} />
            </div>
          </h2>
          <p className={styles.description}>{desc}</p>
        </div>
      </div>
    </header>
  );
}
