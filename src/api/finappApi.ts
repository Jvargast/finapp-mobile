import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.1.83:3000/api/v1";
//const API_URL = "http://172.20.10.2:3000/api/v1";

const finappApi = axios.create({
  baseURL: API_URL,
});

finappApi.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

finappApi.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url && originalRequest.url.includes("/auth/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");

        if (!refreshToken) throw new Error("No hay refresh token");

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        await SecureStore.setItemAsync("access_token", access_token);
        await SecureStore.setItemAsync("refresh_token", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return finappApi(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default finappApi;
