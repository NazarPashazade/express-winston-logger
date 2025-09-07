// middleware/request-id.ts
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { asyncLocalStorage } from "../context";

export const requestIdMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();

  asyncLocalStorage.run({ requestId }, () => {
    (req as any).requestId = requestId;
    next();
  });
};
