import axiosInstance from './axiosInstance';

export const getDashboardStats = () => axiosInstance.get('/admin/dashboard');

export const getUsers = (params) => axiosInstance.get('/admin/users', { params });

export const getUserDetail = (id) => axiosInstance.get(`/admin/users/${id}`);

export const createUser = (payload) => axiosInstance.post('/admin/users', payload);

export const getStores = (params) => axiosInstance.get('/admin/stores', { params });

export const createStore = (payload) => axiosInstance.post('/admin/stores', payload);
