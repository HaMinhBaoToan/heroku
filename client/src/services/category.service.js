import axios from "axios";
import authHeader from "./auth-header";
import { localparseJson } from "../utils/utils";

export default function UserService() {
  const tokenString = localStorage.getItem("AcademyOnline_Token");
  const accessToken = localparseJson(tokenString).accessToken;

  const API_URL = "http://localhost:4000/api/category";


  const getAllCategory = () => {
    return axios.get(`${API_URL}`, { headers: authHeader(accessToken) });
  }; 
  const getSingleCategory = (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader(accessToken) });
  };
  const addCategory = (values) => {
    return axios.post(`${API_URL}`,values, { headers: authHeader(accessToken) });
  };
  const setSingleCategory = (id, values) => {
    return axios.put(`${API_URL}/${id}`, values, { headers: authHeader(accessToken) });
  };
  const deleteSingleCatagory = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader(accessToken) });
  };
  const getCatagorybyUserID = (id) => {
    return axios.get(`${API_URL}/byUser/${id}`, { headers: authHeader(accessToken) });
  };
  return {
    getAllCategory,
    addCategory,
    deleteSingleCatagory,
    setSingleCategory,
    getCatagorybyUserID,
    getSingleCategory
  };
}
