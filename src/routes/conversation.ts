import { Router } from "express";
import { createConversation, getConversations, getConversation, deleteConversation } from "../controllers/conversationController";
import { authenticateToken } from "../middleware/auth";

// 대화 관련 경로 상수
const CONVERSATION_ROUTES = {
    ROOT: "/",
    BY_ID: "/:conversationId"
};

const router = Router();

// 라우터 설정
router.post(CONVERSATION_ROUTES.ROOT, authenticateToken, createConversation);
router.get(CONVERSATION_ROUTES.ROOT, authenticateToken, getConversations);
router.get(CONVERSATION_ROUTES.BY_ID, authenticateToken, getConversation);
router.delete(CONVERSATION_ROUTES.BY_ID, authenticateToken, deleteConversation);

export default router; 