import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Conversation } from "./Conversation";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => Conversation, conversation => conversation.user)
    conversations: Conversation[];

    @CreateDateColumn()
    createdAt: Date;
} 