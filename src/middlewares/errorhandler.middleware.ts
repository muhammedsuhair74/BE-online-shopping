import type { NextFunction, Request, Response } from "express";

export default function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    console.log('Hello i am middleware');
    console.log(err.message);
    res.status(500).json({ message: err.message });
    next();
}