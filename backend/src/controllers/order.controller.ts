import { ClientSession } from 'mongoose';
import { Request, Response } from 'express';

import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';

import {
  handleConfirmOrder,
  handleDeleteOrder,
  handleGetOrders,
  handleOrderCreation,
} from '../services/order.services';

import { DecodedToken } from '../types/req.type';

export const getOrderByUser = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;
  try {
    const orders = await handleGetOrders(req.userId, session);
    return sendResponse(res, 200, 'Get Orders', {
      orders,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const createOrder = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const session: ClientSession = req.session!;

  try {
    const { orderData } = req.body;
    const newOrder = await handleOrderCreation(orderData, req.userId, session);
    /* const branchData = await BranchesModel.findOne({ id: newProduct.branchId }); */
    return sendResponse(res, 201, 'Created Order Successfully', newOrder);
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};



export const deleteOrder = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { orderId } = req.body;
    const order = await handleDeleteOrder(
      orderId,
      session
    );
    return sendResponse(res, 201, 'Role assigned', {
      order,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { orderId } = req.body;
    const order = await handleConfirmOrder(
      orderId,
      session
    );
    return sendResponse(res, 201, 'Role assigned', {
      order,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};