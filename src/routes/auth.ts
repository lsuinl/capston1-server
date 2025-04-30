import { Router } from "express";
import { register, login } from "../controllers/userController";

// 인증 관련 경로 상수
const AUTH_ROUTES = {
    SIGNUP: "/signup",
    LOGIN: "/login"
};

const router = Router();

// 라우터 설정
router.post(AUTH_ROUTES.SIGNUP, register);
router.post(AUTH_ROUTES.LOGIN, login);

export default router; 