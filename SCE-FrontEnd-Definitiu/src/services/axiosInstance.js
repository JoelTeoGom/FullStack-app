import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// Interceptor para imprimir el endpoint y los datos de la solicitud antes de enviarla
axiosInstance.interceptors.request.use((config) => {
  console.log('Request endpoint:', `${config.baseURL}${config.url}`);
  console.log('Request data:', config.data);
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
