import { Response } from "express";
import { AppDataSource } from "../config/database";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { CustomRequest } from "../types";

const chatRepository = AppDataSource.getRepository(Chat);
const userRepository = AppDataSource.getRepository(User);

export const saveChat = async (req: CustomRequest, res: Response) => {
    try {
        const { message } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.id;

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const chat = chatRepository.create({
            message,
            user,
        });

        await chatRepository.save(chat);
        return res.status(201).json({ message: "Chat saved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error saving chat" });
    }
};

export const getChats = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.id;
        const chats = await chatRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: "DESC" },
        });
        return res.json(chats);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching chats" });
    }
}; 