import { Response } from "express";
import { CustomRequest } from "../types";
import { AppDataSource } from "../config/database";
import { Chat } from "../entities/Chat";
import { Conversation } from "../entities/Conversation";
import { Sender } from "../entities/Chat";

// 에러 메시지 상수
const ERROR_MESSAGES = {
    UNAUTHORIZED: "토큰이 만료되었습니다.",
    NO_CONVERSATION_ID: "대화 ID가 필요합니다.",
    CONVERSATION_NOT_FOUND: "대화를 찾을 수 없습니다.",
    SERVER_ERROR: "에러가 발생했습니다."
};

// 응답 메시지 상수
const SUCCESS_MESSAGES = {
    ANSWER_RECEIVED: "성공적으로 응답을 받았습니다",
    PROBABILITY_CHECKED: "성공적으로 응답을 받았습니다"
};

// 상태 코드 상수
const STATUS_CODES = {
    SUCCESS: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};

// AI 응답 생성 함수 (실제 AI 모델과 연동 필요)
const generateAIResponse = (question: string): string => {
    // TODO: 실제 AI 모델과 연동
    // 임시 응답 생성 로직
    const responses = {
        "날씨": "오늘은 맑고 기온은 20도입니다.",
        "시간": `현재 시간은 ${new Date().toLocaleTimeString()}입니다.`,
        "기본": "죄송합니다. 질문을 이해하지 못했습니다. 다른 방식으로 질문해주세요."
    };

    // 질문 키워드에 따른 응답 반환
    if (question.includes("날씨")) return responses["날씨"];
    if (question.includes("시간")) return responses["시간"];
    return responses["기본"];
};

// 채팅 저장 함수
const saveChat = async (content: string, sender: Sender, conversation: Conversation): Promise<Chat> => {
    const chatRepository = AppDataSource.getRepository(Chat);
    const chat = new Chat();
    chat.content = content;
    chat.sender = sender;
    chat.conversation = conversation;
    return await chatRepository.save(chat);
};

// 대화 확인 함수
const validateConversation = async (conversationId: number, userId: number): Promise<Conversation | null> => {
    const conversationRepository = AppDataSource.getRepository(Conversation);
    return await conversationRepository.findOne({
        where: { id: conversationId, user: { id: userId } }
    });
};

export const answerQuestion = async (req: CustomRequest, res: Response) => {
    try {
        const { question, conversationId } = req.body;
        
        if (!req.user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
                statusCode: STATUS_CODES.UNAUTHORIZED,
                data: { message: ERROR_MESSAGES.UNAUTHORIZED }
            });
        }

        if (!conversationId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                statusCode: STATUS_CODES.BAD_REQUEST,
                data: { message: ERROR_MESSAGES.NO_CONVERSATION_ID }
            });
        }

        const conversation = await validateConversation(conversationId, req.user.id);
        if (!conversation) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                statusCode: STATUS_CODES.NOT_FOUND,
                data: { message: ERROR_MESSAGES.CONVERSATION_NOT_FOUND }
            });
        }

        const answer = generateAIResponse(question);

        // 사용자 질문과 AI 답변 저장
        await saveChat(question, Sender.USER, conversation);
        await saveChat(answer, Sender.AI, conversation);

        return res.status(STATUS_CODES.SUCCESS).json({
            statusCode: STATUS_CODES.SUCCESS,
            data: {
                message: SUCCESS_MESSAGES.ANSWER_RECEIVED,
                content: answer,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(STATUS_CODES.SERVER_ERROR).json({ 
            statusCode: STATUS_CODES.SERVER_ERROR,
            data: { message: ERROR_MESSAGES.SERVER_ERROR }
        });
    }
};

export const checkProbability = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
                statusCode: STATUS_CODES.UNAUTHORIZED,
                data: { message: ERROR_MESSAGES.UNAUTHORIZED }
            });
        }

        // TODO: 실제 AI 모델과 연동하여 주체성 판별
        const probability = 0.92;

        return res.status(STATUS_CODES.SUCCESS).json({
            statusCode: STATUS_CODES.SUCCESS,
            data: {
                message: SUCCESS_MESSAGES.PROBABILITY_CHECKED,
                probability
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(STATUS_CODES.SERVER_ERROR).json({ 
            statusCode: STATUS_CODES.SERVER_ERROR,
            data: { message: ERROR_MESSAGES.SERVER_ERROR }
        });
    }
};
