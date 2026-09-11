import { NextFunction, Request, Response } from "express"
import { UserService } from "../services/UserService"

export class UserController {

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.listAll()
            return res.json(users)
        } catch (error) {
            next(error)
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const user = await UserService.getById(id)
            return res.json(user)
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body

            const user = await UserService.create({
                name,
                email,
                password
            })

            return res.status(201).json(user)

        } catch (error) {
            next(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = (req as any).user.id
            const { name, email, password } = req.body

            const user = await UserService.update(id, { name, email, password })

            return res.json(user)
        } catch (error) {
            next(error)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            await UserService.delete(id)
            return res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
