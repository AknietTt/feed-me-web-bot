import React from "react";
import styles from "./Header.module.css";
import { FaClock } from "react-icons/fa6";
import { FaTruckFast } from "react-icons/fa6";

export default function Header({ photo  , name , desc}) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={photo} width="100%" height="auto" />
      </div>
      <div className="info">
        <div style={{ marginLeft: 20 }}>
          <h2 style={{ margin: 0, marginTop: 10, }}>{name}</h2>
          <p style={{ margin: 0, marginTop: 5 , fontWeight:500}}>{desc}</p>
        </div>
        <div style={{ marginLeft: 20  , marginTop:20}}>
          <p style={{ fontSize: 12 }}><FaClock/>  Открыто до 00:00</p>
          <p style={{ fontSize: 12 }}><FaTruckFast/>  Доставка через 50-60 мин</p>
        </div>
      </div>
    </header>
  );
}
