import axios from "axios"
import { HOST } from "../constants";

export const getCities  = async()=>{
   const result = await axios.get(`${HOST}/city/all`);
   return result.data;
}

