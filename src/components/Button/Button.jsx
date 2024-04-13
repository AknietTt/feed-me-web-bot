// Button.js
import React from 'react';
import styles from './Button.module.css';

const Button = ({ children , onClick , style , disable}) => {
  const buttonStyle = disable ? { ...style, backgroundColor: "#cccccc" } : style;

  return (
    <button className={styles.button} onClick={onClick} style={buttonStyle} disabled={disable}>
      {children}
    </button>
  );
}

export default Button;
