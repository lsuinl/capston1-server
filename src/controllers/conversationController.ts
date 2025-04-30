import { Response } from "express";
import { AppDataSource } from "../config/database";
import { Conversation } from "../entities/Conversation";
import { CustomRequest } from "../types";

const conversationRepository = AppDataSource.getRepository(Conversation);

export const createConversation = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                statusCode: 401,
                data: { message: "토큰이 만료되었습니다." }
            });
        }

        const { title } = req.body;
        const conversation = conversationRepository.create({
            title: title || "새로운 대화",
            user: req.user
        });

        await conversationRepository.save(conversation);
        return res.status(201).json({
            statusCode: 201,
            data: {
                conversationId: conversation.id.toString(),
                title: conversation.title,
                message: "성공적으로 응답을 받았습니다"
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            statusCode: 500,
            data: { message: "에러가 발생하였습니다." }
        });
    }
};

export const getConversations = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                statusCode: 401,
                data: { message: "토큰이 만료되었습니다." }
            });
        }

        const conversations = await conversationRepository.find({
            where: { user: { id: req.user.id } },
            order: { createdAt: "DESC" },
        });

        const formattedConversations = conversations.map(conv => ({
            conversationId: conv.id.toString(),
            title: conv.title,
            createdAt: conv.createdAt.toISOString().split('T')[0]
        }));

        return res.status(201).json({
            statusCode: 201,
            data: {
                message: "성공적으로 응답을 받았습니다",
                conversations: formattedConversations
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            statusCode: 500,
            data: { message: "에러가 발생하였습니다." }
        });
    }
};

export const getConversation = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                statusCode: 401,
                data: { message: "토큰이 만료되었습니다." }
            });
        }

        const conversationId = Number(req.params.conversationId);
        const conversation = await conversationRepository.findOne({
            where: { id: conversationId, user: { id: req.user.id } },
            relations: ["chats"]
        });

        if (!conversation) {
            return res.status(404).json({ 
                statusCode: 404,
                data: { message: "내용을 찾을 수 없습니다." }
            });
        }

        const messages = conversation.chats.map(chat => ({
            sender: chat.sender,
            content: chat.content,
            timestamp: chat.createdAt.toISOString()
        }));

        return res.status(201).json({
            statusCode: 201,
            data: {
                conversationId: conversation.id.toString(),
                title: conversation.title,
                message: "성공적으로 응답을 받았습니다",
                messages
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            statusCode: 500,
            data: { message: "에러가 발생하였습니다." }
        });
    }
};

export const deleteConversation = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                statusCode: 401,
                data: { message: "토큰이 만료되었습니다." }
            });
        }

        const conversationId = Number(req.params.conversationId);
        const conversation = await conversationRepository.findOne({
            where: { id: conversationId, user: { id: req.user.id } }
        });

        if (!conversation) {
            return res.status(404).json({ 
                statusCode: 404,
                data: { message: "내용을 찾을 수 없습니다." }
            });
        }

        await conversationRepository.remove(conversation);
        return res.json({ 
            statusCode: 200,
            data: { message: "성공적으로 삭제되었습니다." }
        });
    } catch (error) {
        return res.status(500).json({ 
            statusCode: 500,
            data: { message: "에러가 발생하였습니다." }
        });
    }
}; 