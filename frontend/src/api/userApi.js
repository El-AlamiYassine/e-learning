import axiosInstance from './axiosInstance';

export const updateProfileApi = (data) => axiosInstance.put('/users/profile', data);
