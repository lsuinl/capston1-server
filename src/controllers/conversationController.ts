import { Response } from "express";
import { AppDataSource } from "../config/database";
import { Conversation } from "../entities/Conversation";
import { CustomRequest } from "../types";

const conversationRepository = AppDataSource.getRepository(Conversation);

export const createConversation = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { title } = req.body;
        const conversation = conversationRepository.create({
            title: title || "New Conversation",
            user: req.user
        });

        await conversationRepository.save(conversation);
        return res.status(201).json(conversation);
    } catch (error) {
        return res.status(500).json({ message: "Error creating conversation" });
    }
};

export const getConversations = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const conversations = await conversationRepository.find({
            where: { user: { id: req.user.id } },
            order: { createdAt: "DESC" },
        });
        return res.json(conversations);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching conversations" });
    }
};

export const deleteConversation = async (req: CustomRequest, res: Response) => {
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

        await conversationRepository.remove(conversation);
        return res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting conversation" });
    }
}; 