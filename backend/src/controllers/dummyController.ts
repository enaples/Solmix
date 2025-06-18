import { Request, Response } from "express";

export const dummyData = (_req: Request, res: Response) => {
  res.json({
    message: "This is dummy data",
    timestamp: new Date().toISOString()
  });
};