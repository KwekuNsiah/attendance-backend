import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import Jwt from "jsonwebtoken";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      employee?: { id: string; email: string };
    }
  }
}

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const autHeader = req.headers.authorization;

  if (autHeader) {
    const token = autHeader.split("")[1];

    const secret = process.env.JWT_SECRET;
    console.log("token :>> ", token);

    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET is not defined" });
    }

    Jwt.verify(token, secret, (err, employee) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.employee = employee as { id: string; email: string };
      next();
    });
  } else {
    res.status(401).json({ message: "Authentication token missing " });
  }
};
