import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const getUser = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secret_key", (err) => {
    if (err) return res.sendStatus(403);
    res.send("Protected resource accessed");
  });
};
