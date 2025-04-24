import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Conversation } from "./Conversation";

export enum Sender {
    USER = "user",
    AI = "ai"
}

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    content: string;

    @Column({
        type: "enum",
        enum: Sender
    })
    sender: Sender;

    @ManyToOne(() => Conversation, conversation => conversation.chats)
    conversation: Conversation;

    @CreateDateColumn()
    createdAt: Date;
} 