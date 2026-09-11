import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column({ type: "text" })
    content!: string

    // Cada post pertence a um usuário
    @ManyToOne(() => User, (user) => user.posts)
    user!: User
}
