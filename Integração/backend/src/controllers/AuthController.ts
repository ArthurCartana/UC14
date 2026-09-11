import { NextFunction, Request, Response } from "express"
import { UserService } from "../services/UserService"

export class AuthController {

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body

            // Chamamos o Service para fazer a regra de login
            const result = await UserService.login({
                email,
                password
            })

            // Se deu certo, retornamos usuário sem senha + token
            return res.json(result)

        } catch (error) {
            // Se deu erro, mandamos para o errorHandler
            next(error)
        }
    }
}
