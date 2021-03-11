import axios from "axios";
import authHeader from "./auth-header";
import { localparseJson } from "../utils/utils";

export default function UserService() {
  const tokenString = localStorage.getItem("AcademyOnline_Token");
  const accessToken = localparseJson(tokenString).accessToken;

  const API_URL = " /api/product";


  const getAllProduct = () => {
    return axios.get(`${API_URL}`, { headers: authHeader(accessToken) });
  }; 

  const getProductByCategoryID = (id) => {
    return axios.get(`${API_URL}/byCategory/${id}`, { headers: authHeader(accessToken) });
  };
  return {
    getAllProduct,
    getProductByCategoryID,
   
  };
}
