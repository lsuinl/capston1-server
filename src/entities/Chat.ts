import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    message: string;

    @ManyToOne(() => User, user => user.chats)
    user: User;

    @CreateDateColumn()
    createdAt: Date;
} 