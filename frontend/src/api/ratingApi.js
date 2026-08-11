import axiosInstance from './axiosInstance';

export const submitRating = (storeId, rating) =>
  axiosInstance.post(`/ratings/stores/${storeId}`, { rating });

export const getOwnerDashboard = () => axiosInstance.get('/ratings/owner/dashboard');
