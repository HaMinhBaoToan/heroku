import axios from "axios";

export default function AuthService() {
  const API_auth = "http://localhost:4000/api/auth";

  const register = (velues) => {
    return axios.post(`${API_auth}/register`, velues);
  };

  const registerWithGoogle = (values) => {
    return axios.post(`${API_auth}/register-with-google`, values);
  };

  const login = (values) => {
    return axios.post(`${API_auth}/log-in`, values);
  };

  const loginWithGoogle = (values) => {
    return axios.post(`${API_auth}/log-in-with-google`, values);
  };

  const checkEmail = (values) => {
    return axios.post(`${API_auth}/check-email`, values);
  };
  const checkOTPEmail = (values) => {
    return axios.post(`${API_auth}/check-otp-email`, values);
  };
  const resetPassword = (values) => {
    return axios.post(`${API_auth}/forgot-password`, values);
  };
  const changePassword = (values) => {
    return axios.post(`${API_auth}/change-password`, values);
  };

  const logout = () => {
    const tokenString = localStorage.getItem("AcademyOnline_Token");
    if (tokenString) {
      localStorage.removeItem("AcademyOnline_Token");
    }
  };

  const updateOTP = (id) => {
    return axios.put(`${API_auth}/register/${id}`);
  };
  const checkOTPDB = async (id, otp) => {
    return await axios.get(`${API_auth}/register/${id}/${otp}`);
  };
  const getProfile = async (values) => {
    return await axios.post(`${API_auth}/profile-user`, values);
  };
  const editProfile = async (values) => {
    return await axios.post(`${API_auth}/edit-profile`, values);
  };

  const refresh = (values) => {
    return axios.post(`${API_auth}/refresh`, values);
  };
  return {
    register,
    login,
    logout,
    updateOTP,
    checkOTPDB,
    checkEmail,
    resetPassword,
    checkOTPEmail,
    changePassword,
    getProfile,
    editProfile,
    registerWithGoogle,
    loginWithGoogle,
    refresh,
  };
}
