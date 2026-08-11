import axiosInstance from './axiosInstance';

export const loginRequest = (payload) => axiosInstance.post('/auth/login', payload);

export const signupRequest = (payload) => axiosInstance.post('/auth/signup', payload);

export const changePasswordRequest = (payload) => axiosInstance.patch('/auth/password', payload);
