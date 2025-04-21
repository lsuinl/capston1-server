"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = exports.saveChat = void 0;
const database_1 = require("../config/database");
const Chat_1 = require("../entities/Chat");
const User_1 = require("../entities/User");
const chatRepository = database_1.AppDataSource.getRepository(Chat_1.Chat);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const saveChat = async (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({ message: "Error saving chat" });
    }
};
exports.saveChat = saveChat;
const getChats = async (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching chats" });
    }
};
exports.getChats = getChats;
//# sourceMappingURL=chatController.js.map