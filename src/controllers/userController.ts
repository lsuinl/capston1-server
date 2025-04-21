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
        const { username, password, email } = req.body;

        const existingUser = await userRepository.findOne({ where: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            username,
            password: hashedPassword,
            email,
        });

        await userRepository.save(user);
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error creating user" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const user = await userRepository.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "your_jwt_secret_key",
            { expiresIn: "24h" }
        );

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Error logging in" });
    }
}; 