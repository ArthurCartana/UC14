import { AppDataSource } from "../config/data-source"
import { Post } from "../models/Post"
import { User } from "../models/User"
import { NotFoundError } from "./UserService"
import { omitPassword } from "../utils/omitPassword"

const postRepo = AppDataSource.getRepository(Post)
const userRepo = AppDataSource.getRepository(User)

export class ForbiddenError extends Error {}

export const PostService = {

    // Lista todos os posts junto com o autor
    async listAll() {

        const posts = await postRepo.find({
            relations: {
                user: true
            }
        })

        // Remove a senha do usuário antes de retornar
        return posts.map(post => ({
            ...post,
            user: omitPassword(post.user)
        }))
    },


    // Busca um post pelo id
    async getById(id: number) {

        const post = await postRepo.findOne({
            where: {
                id
            },
            relations: {
                user: true
            }
        })

        if (!post) {
            throw new NotFoundError("Post não encontrado!")
        }

        return {
            ...post,
            user: omitPassword(post.user)
        }
    },


    // Cria um post para o usuário autenticado
    async create(
        userId: number,
        data: {
            title: string
            content: string
        }
    ) {

        // O userId vem do JWT validado pelo authMiddleware
        const user = await userRepo.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundError("Usuário não encontrado!")
        }

        const post = postRepo.create({
            title: data.title,
            content: data.content,
            user
        })

        const savedPost = await postRepo.save(post)

        return {
            ...savedPost,
            user: omitPassword(user)
        }
    },


    // Atualiza um post
    async update(
        postId: number,
        userId: number,
        data: {
            title?: string
            content?: string
        }
    ) {

        const post = await postRepo.findOne({
            where: {
                id: postId
            },
            relations: {
                user: true
            }
        })

        if (!post) {
            throw new NotFoundError("Post não encontrado!")
        }

        // O usuário só pode alterar posts que pertencem a ele
        if (post.user.id !== userId) {
            throw new ForbiddenError(
                "Você não tem permissão para alterar este post!"
            )
        }

        if (data.title !== undefined) {
            post.title = data.title
        }

        if (data.content !== undefined) {
            post.content = data.content
        }

        const updatedPost = await postRepo.save(post)

        return {
            ...updatedPost,
            user: omitPassword(updatedPost.user)
        }
    },


    // Exclui um post
    async delete(postId: number, userId: number) {

        const post = await postRepo.findOne({
            where: {
                id: postId
            },
            relations: {
                user: true
            }
        })

        if (!post) {
            throw new NotFoundError("Post não encontrado!")
        }

        // O usuário só pode excluir posts que pertencem a ele
        if (post.user.id !== userId) {
            throw new ForbiddenError(
                "Você não tem permissão para excluir este post!"
            )
        }

        await postRepo.remove(post)
    }
}