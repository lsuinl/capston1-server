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
        return res.status(401).json({ message: "Access token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key") as JwtPayload;
        req.user = { id: decoded.userId };
        next();
        return;
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}; 