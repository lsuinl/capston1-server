"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Chat_1 = require("../entities/Chat");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: process.env.DATABASE_PATH || "./database.sqlite",
    synchronize: true,
    logging: true,
    entities: [User_1.User, Chat_1.Chat],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=database.js.map