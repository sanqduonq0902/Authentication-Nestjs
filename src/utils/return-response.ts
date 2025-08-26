import { Response } from 'express';

export const returnRes = (
  res: Response,
  statusCode: number,
  message: string,
  data?: object | string,
) => {
  return res.status(statusCode).json({
    message: message,
    data: data,
  });
};
