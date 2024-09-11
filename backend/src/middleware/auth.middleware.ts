import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { DecodedToken } from '../types/req.type';

import { AuthenticationError, RequestError } from '../utils/globalErrorHandler';
import { findOneUser } from '../services/user.services';

const verifyToken = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization');
  if (!token) {
    return next(new AuthenticationError('Missing Authorization Header'));
  }

  try {
    const secretKey: string = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    req.userId = decoded.userId;

    const existingUser = await findOneUser({ id: decoded.userId });

    if (existingUser && existingUser.loginStatus) {
      next();
    } else {
      next(new RequestError(`This user have already logged out!`));
    }
  } catch (error) {
    next(new AuthenticationError('Invalid Token'));
  }
};

export default verifyToken;
