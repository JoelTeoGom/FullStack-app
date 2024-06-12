import axiosInstance from './axiosInstance';

const CART_API_URL = '/cart';

export const addToCart = (productId, quantity) => {
  return axiosInstance.post(`${CART_API_URL}/add`, { productId, quantity });
};

export const removeFromCart = (productId) => {
  return axiosInstance.delete(`${CART_API_URL}/remove/${productId}`);
};

export const updateCartItemQuantity = (productId, quantity) => {
  return axiosInstance.put(`${CART_API_URL}/update`, { productId, quantity });
};

export const getCart = () => {
  return axiosInstance.get(CART_API_URL);
};
