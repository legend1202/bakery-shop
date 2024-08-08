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
  },
  mng: {
    product: {
      create: '/api/mng/product/register',
      listByUser: '/api/mng/product/get-products-by-user',
      delete: '/api/mng/product/delete',
    },
    supply: {
      create: '/api/mng/supply/register',
      listByUser: '/api/mng/supply/get-supply-by-user',
      delete: '/api/mng/supply/delete',
    },
  },
};
