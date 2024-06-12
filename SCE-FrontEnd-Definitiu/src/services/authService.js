import axiosInstance from './axiosInstance';

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export default {
  login,
  register,
};
