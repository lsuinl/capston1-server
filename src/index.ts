import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import router from "./routes";
import dotenv from "dotenv";

// 환경 변수 설정
dotenv.config();

// 상수 정의
const SERVER_CONFIG = {
    PORT: process.env.PORT || 3000,
    MESSAGES: {
        DB_INITIALIZED: "Data Source has been initialized!",
        DB_INIT_ERROR: "Error during Data Source initialization:",
        SERVER_STARTED: (port: string | number) => `Server is running on port ${port}`
    }
};

// Express 앱 설정
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 데이터베이스 초기화
const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log(SERVER_CONFIG.MESSAGES.DB_INITIALIZED);
    } catch (error) {
        console.error(SERVER_CONFIG.MESSAGES.DB_INIT_ERROR, error);
        process.exit(1); // 데이터베이스 연결 실패 시 서버 종료
    }
};

// 라우터 설정
app.use(router);

// 서버 시작
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(SERVER_CONFIG.PORT, () => {
            console.log(SERVER_CONFIG.MESSAGES.SERVER_STARTED(SERVER_CONFIG.PORT));
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer(); 