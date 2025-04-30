import { Router } from "express";
import authRouter from "./auth";
import chatRouter from "./chat";
import conversationRouter from "./conversation";

// API 경로 상수
const API_ROUTES = {
    AUTH: "/api/auth",
    CHAT: "/api/chat",
    CONVERSATIONS: "/api/conversations"
};

const router = Router();

// 라우터 설정
router.use(API_ROUTES.AUTH, authRouter);
router.use(API_ROUTES.CHAT, chatRouter);
router.use(API_ROUTES.CONVERSATIONS, conversationRouter);

export default router; 