import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { DecodedToken } from '../types/req.type';

import { AuthenticationError } from '../utils/globalErrorHandler';

const verifyToken = (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization');
  if (!token) {
    return next(new AuthenticationError('Missing Authorization Header'));
  }

  try {
    const secretKey: string = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid Token'));
  }
};

export default verifyToken;
