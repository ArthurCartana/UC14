import { NextFunction, Request, Response } from "express"
import { PostService } from "../services/PostService"

export class PostController {

    // Lista todos os posts
    async list(req: Request, res: Response, next: NextFunction) {
        try {

            const posts = await PostService.listAll()

            return res.json(posts)

        } catch (error) {
            next(error)
        }
    }


    // Busca um post pelo id
    async getById(req: Request, res: Response, next: NextFunction) {
        try {

            const id = Number(req.params.id)

            const post = await PostService.getById(id)

            return res.json(post)

        } catch (error) {
            next(error)
        }
    }


    // Cria um novo post
    async create(req: Request, res: Response, next: NextFunction) {
        try {

            // Esse id foi colocado no req pelo authMiddleware
            // depois que o JWT foi validado
            const userId = (req as any).user.id

            const { title, content } = req.body

            const post = await PostService.create(
                userId,
                {
                    title,
                    content
                }
            )

            return res.status(201).json(post)

        } catch (error) {
            next(error)
        }
    }


    // Atualiza um post
    async update(req: Request, res: Response, next: NextFunction) {
        try {

            // O id do post vem da URL
            const postId = Number(req.params.id)

            // O id do usuário vem do JWT
            const userId = (req as any).user.id

            const { title, content } = req.body

            const post = await PostService.update(
                postId,
                userId,
                {
                    title,
                    content
                }
            )

            return res.json(post)

        } catch (error) {
            next(error)
        }
    }


    // Exclui um post
    async delete(req: Request, res: Response, next: NextFunction) {
        try {

            const postId = Number(req.params.id)

            // O dono da ação vem do JWT
            const userId = (req as any).user.id

            await PostService.delete(
                postId,
                userId
            )

            return res.status(204).send()

        } catch (error) {
            next(error)
        }
    }
}