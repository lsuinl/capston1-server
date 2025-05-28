import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    try {
        const { password, email } = req.body;

        const existingUser = await userRepository.findOne({ where: [{ email }] });
        if (existingUser) {
            return res.status(400).json({ 
                statusCode: 400,
                message: "이미 존재하는 이메일입니다.",
                data: {}
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            password: hashedPassword,
            email,
        });

        await userRepository.save(user);

        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "jwt_secret_key",
            { expiresIn: "24h" }
        );

        return res.status(201).json({
            statusCode: 201,
            message: "회원가입이 완료되었습니다.",
            data: {
                accessToken,
                userId: user.id.toString(),
                created_at: user.createdAt.toISOString().split('T')[0]
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            statusCode: 500,
            message: "에러가 발생하였습니다.",
            data: {}
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                statusCode: 401,
                message: "이메일 또는 비밀번호가 일치하지 않습니다.",
                data: {}
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                statusCode: 401,
                message: "이메일 또는 비밀번호가 일치하지 않습니다.",
                data: {}
            });
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "jwt_secret_key",
            { expiresIn: "24h" }
        );

        return res.status(201).json({
            statusCode: 201,
            message: "로그인이 완료되었습니다.",
            data: {
                accessToken,
                userId: user.id.toString()
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            statusCode: 500,
            message: "에러가 발생하였습니다.",
            data: {}
        });
    }
}; 