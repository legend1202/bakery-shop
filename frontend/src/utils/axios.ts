import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

if (sessionStorage.getItem('accessToken')) {
  axios.defaults.headers.common.Authorization = sessionStorage.getItem('accessToken');
}

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { params: { ...config } });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  admin: {
    create: '/api/auth/register',
    userList: '/api/auth/get-users',
    userRoleUpdate: '/api/auth/assign-role',
    userDelete: '/api/auth/delete',
  },
  branch: {
    create: '/api/branch/register',
    list: '/api/branch/get-branches',
    delete: '/api/branch/delete',
  },
  product: {
    create: '/api/product/register',
    update: '/api/product/update',
    list: '/api/product/get-products',
    listByUser: '/api/product/get-products-by-user',
    delete: '/api/product/delete',
  },
  supply: {
    create: '/api/supply/register',
    list: '/api/supply/get-supply',
    listByUser: '/api/supply/get-supply-by-user',
    delete: '/api/supply/delete',
  },
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  mng: {
    product: {
      create: '/api/mng/product/register',
      listByUser: '/api/mng/product/get-products-by-user',
      list: '/api/mng/product/get-products',
      delete: '/api/mng/product/delete',
      confirm: '/api/mng/product/confirm',
    },
    customerOrder: {
      create: '/api/mng/custom_order/register',
      listByUser: '/api/mng/custom_order/get-products-by-user',
      list: '/api/mng/custom_order/get-products',
      delete: '/api/mng/custom_order/delete',
      confirm: '/api/mng/custom_order/confirm',
    },
    supply: {
      create: '/api/mng/supply/register',
      listByUser: '/api/mng/supply/get-supply-by-user',
      delete: '/api/mng/supply/delete',
      confirm: '/api/mng/supply/confirm',
    },
  },
  sale: {
    create: '/api/sale/register',
    listByUser: '/api/sale/get-sale-by-user',
    delete: '/api/sale/delete',
  },
  attendance: {
    create: '/api/attendance/register',
    listByUser: '/api/attendance/get-attendance-by-user',
    list: '/api/attendance/get-attendance',
    delete: '/api/attendance/delete',
  },
  upload: '/api/upload',
  inventory: {
    branch: '/api/inventory/branch',
    product: '/api/inventory/product',
    supply: '/api/inventory/supply',
  },
};
