import { NextFunction, Request, Response } from "express"

// Middleware simples para validar os dados de cadastro de usuário
export function validateUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Nome, email e senha são obrigatórios."
        })
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "A senha precisa ter pelo menos 6 caracteres."
        })
    }

    next()
}
