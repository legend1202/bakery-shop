import axiosInstance, { endpoints } from 'src/utils/axios';

import { HOST_API } from 'src/config-global';

import { IImageType } from 'src/types/product';

const URL = endpoints.upload;

export const upload = async (query: IImageType) => {
  const formData = new FormData();

  query.forEach((image) => {
    formData.append('images', image);
  });

  const res = await axiosInstance.post(URL, formData);

  return `${HOST_API}/${res.data?.result?.image_urls[0]}`;
};
