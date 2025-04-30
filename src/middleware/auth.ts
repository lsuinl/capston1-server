import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomRequest } from "../types";

dotenv.config();

interface JwtPayload {
    userId: number;
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            statusCode: 401,
            data: { message: "토큰이 필요합니다." }
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt key") as JwtPayload;
        req.user = { id: decoded.userId };
        next();
        return;
    } catch (error) {
        return res.status(403).json({ 
            statusCode: 403,
            data: { message: "만료된 토큰입니다." }
        });
    }
}; 