import axios from "axios";
import authHeader from "./auth-header";
import { localparseJson } from "../utils/utils";

export default function UserService() {
  const tokenString = localStorage.getItem("AcademyOnline_Token");
  const accessToken = localparseJson(tokenString).accessToken;

  const API_URL = "http://localhost:4000/api/product";


  const getAllProduct = () => {
    return axios.get(`${API_URL}`, { headers: authHeader(accessToken) });
  }; 

  const getProductByCategoryID = (id) => {
    return axios.get(`${API_URL}/byCategory/${id}`, { headers: authHeader(accessToken) });
  };

  const setSingleProduct = (id, values) => {
    return axios.put(`${API_URL}/${id}`, values, { headers: authHeader(accessToken) });
  };
  const addProduct = (values) => {
    return axios.post(`${API_URL}`,values, { headers: authHeader(accessToken) });
  };
  const deleteSingleProduct = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader(accessToken) });
  };
  return {
    getAllProduct,
    getProductByCategoryID,
    setSingleProduct,
    addProduct,
    deleteSingleProduct
  };
}
