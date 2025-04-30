import { Router } from "express";
import { answerQuestion, checkProbability } from "../controllers/chatController";
import { authenticateToken } from "../middleware/auth";

// 채팅 관련 경로 상수
const CHAT_ROUTES = {
    ANSWER: "/answer",
    PROBABILITY: "/probability"
};

const router = Router();

// 라우터 설정
router.post(CHAT_ROUTES.ANSWER, authenticateToken, answerQuestion);
router.post(CHAT_ROUTES.PROBABILITY, authenticateToken, checkProbability);

export default router; 