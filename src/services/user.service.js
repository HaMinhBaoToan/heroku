import axios from "axios";
import authHeader from "./auth-header";
import { localparseJson } from "../utils/utils";

export default function UserService() {
  const tokenString = localStorage.getItem("AcademyOnline_Token");
  const accessToken = localparseJson(tokenString).accessToken;

  const API_URL = "/api/users";

  const getUserByID = (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader(accessToken) });
  };

  const getAllUser = () => {
    return axios.get(`${API_URL}/`, { headers: authHeader(accessToken) });
  };
  const setSingleUser = (id, values) => {
    return axios.put(`${API_URL}/${id}`, values, {
      headers: authHeader(accessToken),
    });
  };
  const deleteSingleUser = (id) => {
    return axios.delete(`${API_URL}/${id}`, {
      headers: authHeader(accessToken),
    });
  };
  const getAllFavoriteCategory = (id) => {
    return axios.get(`${API_URL}/favorite-category/${id}`, {
      headers: authHeader(accessToken),
    });
  };
  const getCategorysUser = (id) => {
    debugger;
    return axios.get(`${API_URL}/category-user/${id}`, {
      headers: authHeader(accessToken),
    });
  };

  return {
    getUserByID,
    getAllUser,
    setSingleUser,
    deleteSingleUser,
    getAllFavoriteCategory,
    getCategorysUser,
  };
}
