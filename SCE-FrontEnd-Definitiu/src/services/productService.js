import axiosInstance from './axiosInstance';

const API_URL = '/products';

export const getAllProducts = ({ brand, type, minPrice, maxPrice, name }) => {
  let query = `${API_URL}?`;
  if (brand) query += `brand=${brand}&`;
  if (type) query += `type=${type}&`;
  if (minPrice) query += `minPrice=${minPrice}&`;
  if (maxPrice) query += `maxPrice=${maxPrice}&`;
  if (name) query += `name=${name}&`;
  return axiosInstance.get(query);
};

export const getProductById = (id) => {
  return axiosInstance.get(`${API_URL}/${id}`);
};

export const getBrands = () => {
  return axiosInstance.get(`${API_URL}/brands`);
};

export const getTypes = () => {
  return axiosInstance.get(`${API_URL}/types`);
};

export const getProductByName = (name) => {
  return axiosInstance.get(`${API_URL}/search`, {
    params: { name }
  });
};
