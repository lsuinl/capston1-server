import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Chat } from "../entities/Chat";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.DATABASE_PATH || "./database.sqlite",
    synchronize: true,
    logging: true,
    entities: [User, Chat],
    subscribers: [],
    migrations: [],
}); 