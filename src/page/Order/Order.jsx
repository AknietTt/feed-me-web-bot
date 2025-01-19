import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Order.module.css";
import axios from "axios";
import { cartActions } from "../../store/cartSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { HOST } from "../../constants";

export default function OrderForm() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const location = useLocation();
  const { branchId, orderType, deliverySumm } = location.state;
  const navigate = useNavigate();

  const tg = window.Telegram?.WebApp;
  const telegramUserId = String(tg?.initDataUnsafe?.user?.id || "");
  const telegramChatId = String(tg?.initDataUnsafe?.chat?.id || "");

  const [formData, setFormData] = useState({
    nameCustomer: "",
    phoneNumber: "",
    address: "",
    entrance: "",
    intercom: "",
    apartmentOrOffice: "",
    floor: "",
    comment: "",
    kaspiPayNumber: "", // Добавлено новое поле
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSum = useMemo(() => {
    const cartSum = cartItems.reduce(
      (sum, item) => sum + item.food.price * item.count,
      0
    );
    return cartSum + (orderType === "delivery" ? deliverySumm : 0);
  }, [cartItems, deliverySumm, orderType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderDetailDtos = cartItems.map((item) => ({
      foodId: item.food.id,
      count: item.count,
    }));

    const requestBody = {
      summa: totalSum,
      nameCustomer: formData.nameCustomer,
      phoneNumber: formData.phoneNumber,
      address: orderType === "delivery" ? formData.address : "Самовывоз",
      entrance: orderType === "delivery" ? formData.entrance : "",
      intercom: orderType === "delivery" ? formData.intercom : "",
      apartmentOrOffice:
        orderType === "delivery" ? formData.apartmentOrOffice : "",
      floor: orderType === "delivery" ? formData.floor : "",
      comment: formData.comment,
      kaspiPayNumber: formData.kaspiPayNumber, // Передача нового поля
      telegramChatId: telegramChatId,
      telegramUserId: telegramUserId,
      pickup: orderType === "pickup",
      branchId: branchId,
      orderDetailDtos,
    };

    try {
      const response = await axios.post(`${HOST}/orders`, requestBody);
      console.log(response.data);

      setFormData({
        nameCustomer: "",
        phoneNumber: "",
        address: "",
        entrance: "",
        intercom: "",
        apartmentOrOffice: "",
        floor: "",
        comment: "",
        kaspiPayNumber: "", // Сброс нового поля
      });

      dispatch(cartActions.clean());
      navigate("/feed-me/done");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Произошла ошибка при создании заказа.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.orderContainer}>
      <div className={styles.checkHeader}>
        <h2 className={styles.checkTitle}>Чек заказа</h2>
      </div>
      <div className={styles.orderDetails}>
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.food.id} className={styles.itemRow}>
              <span>{item.food.name}</span>
              <span>
                {item.count} x {item.food.price}₸
              </span>
            </div>
          ))}
        </div>
        {orderType === "delivery" && (
          <div className={styles.detailRow}>
            <span>Доставка:</span>
            <span>{deliverySumm}₸</span>
          </div>
        )}
        <div className={styles.totalRow}>
          <span>Итог:</span>
          <span>{totalSum}₸</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="nameCustomer">Имя</label>
          <input
            type="text"
            id="nameCustomer"
            name="nameCustomer"
            placeholder="Ваше имя"
            value={formData.nameCustomer}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        {orderType === "delivery" && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="address">Адрес</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Введите адрес"
                value={formData.address}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="entrance">Подъезд</label>
              <input
                type="text"
                id="entrance"
                name="entrance"
                placeholder="Номер подъезда"
                value={formData.entrance}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="intercom">Код домофона</label>
              <input
                type="text"
                id="intercom"
                name="intercom"
                placeholder="Код домофона"
                value={formData.intercom}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="apartmentOrOffice">Квартира/Офис</label>
              <input
                type="text"
                id="apartmentOrOffice"
                name="apartmentOrOffice"
                placeholder="Номер квартиры/офиса"
                value={formData.apartmentOrOffice}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="floor">Этаж</label>
              <input
                type="text"
                id="floor"
                name="floor"
                placeholder="Этаж"
                value={formData.floor}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </>
        )}
        <div className={styles.inputGroup}>
          <label htmlFor="phoneNumber">Телефон</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Ваш телефон"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="kaspiPayNumber">Номер для счет на оплату "Kaspi"</label>
          <input
            type="tel"
            id="kaspiPayNumber"
            name="kaspiPayNumber"
            placeholder={`Ваш номер номер "Kaspi"`}
            value={formData.kaspiPayNumber}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="comment">Комментарий</label>
          <textarea
            id="comment"
            name="comment"
            placeholder="Ваш комментарий"
            value={formData.comment}
            onChange={handleChange}
            className={styles.textarea}
          ></textarea>
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправка..." : "Подтвердить"}
        </button>
        <div style={{ marginTop: "200px" }}></div>
      </form>
    </div>
  );
}
