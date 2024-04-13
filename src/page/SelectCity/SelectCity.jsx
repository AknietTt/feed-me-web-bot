import axios from "axios";
import { useEffect, useState } from "react";
import { HOST } from "../../constants";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

function SelectCity() {
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(""); // Состояние для хранения id выбранного города
  const navigate =useNavigate();

  const getCities = async () => {
    const result = await axios.get(`${HOST}/city/all`);
    setSelectedCityId(result.data.value[0].id)
    setCities(result.data.value);
  }

  useEffect(() => {
    getCities();
    setSelectedCityId(cities[0]);
  }, []);

  const handleCityChange = (event) => {
    setSelectedCityId(event.target.value); 
  }

  const handleSelect = () => {
    console.log("Выбран город с id:", selectedCityId);
   navigate(`/restaurant/${selectedCityId}`)
  }

  return (
    <div style={{ textAlign: "center", backgroundColor: "white", height: "100vh" }}>
      <p style={{ paddingTop: 50 }}>Укажите ваш город снизу</p>

      <select
        value={selectedCityId} 
        onChange={handleCityChange} 
        style={{ margin: "auto", backgroundColor: "white", height: 30, width: 170, border: "solid 1px gray", borderRadius: 10 }}>
        
        {cities?.map(city => (
          <option key={city.id} value={city.id}>{city.name}</option>
        ))}
      </select>
      <Button onClick={handleSelect} style={{display: "block", margin: "auto" , marginTop:20}}>Выбрать</Button>
      <div style={{ marginTop: 50 }}>
        <img src="/imageMain.svg" width="200px" alt="Главное изображение" />
      </div>
    </div>
  );
}

export default SelectCity;
