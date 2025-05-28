import { Response } from "express";
import { CustomRequest } from "../types";
import { AppDataSource } from "../config/database";
import { Chat } from "../entities/Chat";
import { Conversation } from "../entities/Conversation";
import { Sender } from "../entities/Chat";
import { AIAddress } from "../const";
import axios from "axios";

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

//--------------------------------------------------
export const answerQuestion = async (req: CustomRequest, res: Response) => {
    try {
        const { question, conversationId } = req.body;
        
        if (!req.user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: ERROR_MESSAGES.UNAUTHORIZED,
                data: {}
            });
        }

        if (!conversationId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: ERROR_MESSAGES.NO_CONVERSATION_ID,
                data: {}
            });
        }

        const conversation = await validateConversation(conversationId, req.user.id);
        if (!conversation) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                statusCode: STATUS_CODES.NOT_FOUND,
                message: ERROR_MESSAGES.CONVERSATION_NOT_FOUND,
                data: {}
            });
        }

        try {
            // ChatGPT API 서버로 요청
            const chatResponse = await axios.post(AIAddress.ANSWER_URL, {
                original_question: question
            });

            const answer = chatResponse.data.answer;

            // 사용자 질문과 AI 답변 저장
            await saveChat(question, Sender.USER, conversation);
            await saveChat(answer, Sender.AI, conversation);

            return res.status(STATUS_CODES.SUCCESS).json({
                statusCode: STATUS_CODES.SUCCESS,
                message: SUCCESS_MESSAGES.ANSWER_RECEIVED,
                data: {
                    content: answer,
                    sender: 'ai',
                    timestamp: new Date().toISOString().split('T')[0]
                }
            });
        } catch (apiError) {
            console.error('ChatGPT API 요청 실패:', apiError);
            return res.status(STATUS_CODES.SERVER_ERROR).json({ 
                statusCode: STATUS_CODES.SERVER_ERROR,
                message: "ChatGPT API 요청에 실패했습니다.",
                data: {}
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(STATUS_CODES.SERVER_ERROR).json({ 
            statusCode: STATUS_CODES.SERVER_ERROR,
            message: ERROR_MESSAGES.SERVER_ERROR,
            data: {}
        });
    }
};

//--------------------------------------------------
export const checkProbability = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: ERROR_MESSAGES.UNAUTHORIZED,
                data: {}
            });
        }

        const { question } = req.body;

        if (!question) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                statusCode: STATUS_CODES.BAD_REQUEST,
                message: "Missing question",
                data: {}
            });
        }

        try {
            // Score 서버로 요청
            const scoreResponse = await axios.post(AIAddress.SCORE_URL, {
                'original_question': question
            });

            return res.status(STATUS_CODES.SUCCESS).json({
                statusCode: STATUS_CODES.SUCCESS,
                message: SUCCESS_MESSAGES.PROBABILITY_CHECKED,
                data: scoreResponse.data
            });
        } catch (scoreError) {
            console.error('Score 서버 요청 실패:', scoreError);
            return res.status(STATUS_CODES.SERVER_ERROR).json({ 
                statusCode: STATUS_CODES.SERVER_ERROR,
                message: "Score 서버 요청에 실패했습니다.",
                data: {}
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(STATUS_CODES.SERVER_ERROR).json({ 
            statusCode: STATUS_CODES.SERVER_ERROR,
            message: ERROR_MESSAGES.SERVER_ERROR,
            data: {}
        });
    }
};
