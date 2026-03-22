import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log("Authentication middleware");
  console.log(req.headers);
  if (!req.headers.authorization) {
    throw new Error("Unauthorized");
  }
  const token = req.headers.authorization?.split(" ")[1];
  const secret = process.env.TOKEN_SECRET;
  console.log("\n\n\n");
  console.log(token, secret);
  if (!secret) {
    throw new Error("Token secret is not set");
  }
  try {
    const decoded = jwt.verify(token as string, secret);
    if (!decoded || typeof decoded === "string") {
      throw new Error("Unauthorized");
    }
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    throw new Error("Unauthorized");
  }
}
