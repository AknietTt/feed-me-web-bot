import axios from "axios";
import { useEffect, useState } from "react";
import { HOST } from "../../constants";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

function SelectCity() {
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(""); // Состояние для хранения id выбранного города
  const navigate = useNavigate();

  const getCities = async () => {
    const result = await axios.get(`${HOST}/cities`);
    setSelectedCityId(result.data.value[0].id);
    setCities(result.data.value);
  };

  useEffect(() => {
    getCities();
    setSelectedCityId(cities[0]);
  }, []);

  const handleCityChange = (event) => {
    setSelectedCityId(event.target.value);
  };

  const handleSelect = () => {
    console.log("Выбран город с id:", selectedCityId);
    navigate(`/feed-me/${selectedCityId}/restaurant`); // Переход с cityId
  };

  return (
    <div
      style={{ textAlign: "center", backgroundColor: "white", height: "100vh" }}
    >
      <p style={{ fontSize: 40 }}>
        <span style={{ color: "#FF4757" }}>F</span>eed
        <span style={{ color: "#FF4757" }}>M</span>e
      </p>
      <img
        style={{ width: 250, height: 170 }}
        src="https://static.tildacdn.com/tild3666-3461-4134-a565-323239373262/1644215923_1-abrakad.png"
        alt=""
        srcset=""
      />
      <p>
        Ваши желания — в одно касание: доставка, самовывоз, бронирование и
        QR-меню!
      </p>
      <p style={{ paddingTop: 10 }}>Укажите ваш город снизу</p>
      <select
        value={selectedCityId}
        onChange={handleCityChange}
        style={{
          margin: "auto",
          backgroundColor: "white",
          height: 30,
          width: 170,
          border: "solid 1px gray",
          borderRadius: 10,
        }}
      >
        {cities?.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      <Button
        onClick={handleSelect}
        style={{ display: "block", margin: "auto", marginTop: 20 }}
      >
        Выбрать
      </Button>
      <div style={{ marginTop: 80 }}>
        <img
          style={{ height: 150, width: 200, float: "right", marginTop: 100 }}
          src="https://demo.cmssuperheroes.com/themeforest/wp-gaucho/wp-content/uploads/2015/11/dish-4-large.png"
          alt="Право"
        />
        <img
          style={{ height: 150, width: 150, float: "left" }}
          src="https://i.pinimg.com/736x/cc/de/29/ccde2998724112a1108c0c47337da15a.jpg"
          alt="Лево"
        />
      </div>
    </div>
  );
}

export default SelectCity;
