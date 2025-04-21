import { Request } from 'express';

export interface CustomRequest extends Request {
    user?: {
        id: number;
    };
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
            };
            body: any;
        }
    }
} 