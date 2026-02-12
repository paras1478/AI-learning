import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://paras-950.duckdns.org/api",
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response?.data || { message: "Network error" }
    );
  }
);

export default axiosInstance;
