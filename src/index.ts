import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import { register, login } from "./controllers/userController";
import { saveChat, getChats } from "./controllers/chatController";
import { createConversation, getConversations, deleteConversation } from "./controllers/conversationController";
import { authenticateToken } from "./middleware/auth";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    });

// User routes
app.post("/api/register", register);
app.post("/api/login", login);

// Conversation routes
app.post("/api/conversations", authenticateToken, createConversation);
app.get("/api/conversations", authenticateToken, getConversations);
app.delete("/api/conversations/:conversationId", authenticateToken, deleteConversation);

// Chat routes
app.post("/api/conversations/:conversationId/chats", authenticateToken, saveChat);
app.get("/api/conversations/:conversationId/chats", authenticateToken, getChats);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 