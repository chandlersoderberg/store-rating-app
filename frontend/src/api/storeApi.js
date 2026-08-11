import axiosInstance from './axiosInstance';

export const getStoresForUser = (params) => axiosInstance.get('/stores', { params });
