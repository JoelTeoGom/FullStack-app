import axiosInstance from './axiosInstance';

const ORDER_API_URL = '/shopping-cart';

export const createOrder = (productIds, quantities) => {
  return axiosInstance.post(`${ORDER_API_URL}/create`, { productIds, quantities });
};
