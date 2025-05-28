import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Chat } from "./Chat";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'json', nullable: true })
    scores: any;

    @ManyToOne(() => User, user => user.conversations)
    user: User;

    @OneToMany(() => Chat, chat => chat.conversation)
    chats: Chat[];
} 