import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Order.module.css";
import axios from "axios";
import { cartActions } from "../../store/cartSlice";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function OrderForm() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const location = useLocation();
  const { branchId, orderType } = location.state; // Получаем id филиала и тип заказа (доставка или самовывоз)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    entrance: "",
    intercomCode: "",
    floor: "",
    apartmentOfficeNumber: "",
    comment: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderDetailDtos = cartItems.map((item) => ({
      foodId: item.food.id,
      count: item.count
    }));

    const requestBody = {
      summa: 0, // Предполагается, что сумма рассчитывается отдельно
      address: orderType === "delivery" ? formData.address : "Самовывоз",
      nameCustomer: formData.name,
      phoneNumber: formData.phoneNumber,
      entrance: orderType === "delivery" ? formData.entrance : "",
      intercom: orderType === "delivery" ? formData.intercomCode : "",
      comment: formData.comment,
      pickup: orderType === "pickup", // Определяем, является ли заказ самовывозом
      branchId: branchId,
      orderDetailDtos
    };

    try {
      const response = await axios.post("https://localhost:7284/Order/create", requestBody);
      console.log(response.data);

      // Очистить форму
      setFormData({
        name: "",
        address: "",
        phoneNumber: "",
        entrance: "",
        intercomCode: "",
        floor: "",
        apartmentOfficeNumber: "",
        comment: ""
      });

      dispatch(cartActions.clean());
      navigate("/done")
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className={styles.orderFormContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Имя"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        {orderType === "delivery" && (
          <>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Адрес"
                value={formData.address}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="entrance"
                name="entrance"
                value={formData.entrance}
                onChange={handleChange}
                className={styles.input}
                placeholder="Подъезд"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="intercomCode"
                name="intercomCode"
                value={formData.intercomCode}
                onChange={handleChange}
                className={styles.input}
                placeholder="Код домофона"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="apartmentOfficeNumber"
                name="apartmentOfficeNumber"
                value={formData.apartmentOfficeNumber}
                onChange={handleChange}
                className={styles.input}
                placeholder="Квартира/Офис"
              />
            </div>
          </>
        )}
        <div className={styles.formGroup}>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Телефон получателя"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Комментарий"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Отправить
        </button>
      </form>
    </div>
  );
}
