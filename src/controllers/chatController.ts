import { Response } from "express";
import { AppDataSource } from "../config/database";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";
import { Conversation } from "../entities/Conversation";
import { CustomRequest } from "../types";

const chatRepository = AppDataSource.getRepository(Chat);
const userRepository = AppDataSource.getRepository(User);
const conversationRepository = AppDataSource.getRepository(Conversation);

export const saveChat = async (req: CustomRequest, res: Response) => {
    try {
        const { message, sender } = req.body;
        const conversationId = Number(req.params.conversationId);
        
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const conversation = await conversationRepository.findOne({
            where: { id: conversationId, user: { id: req.user.id } }
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const chat = chatRepository.create({
            content: message,
            sender: sender,
            conversation: conversation
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
        const conversationId = Number(req.params.conversationId);

        const conversation = await conversationRepository.findOne({
            where: { id: conversationId, user: { id: req.user.id } }
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const chats = await chatRepository.find({
            where: { conversation: { id: conversationId } },
            order: { createdAt: "ASC" },
        });
        return res.json(chats);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching chats" });
    }
}; 