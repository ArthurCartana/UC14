import { NextFunction, Request, Response } from "express"

// Validação usada na criação de posts
export function validatePost(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const { title, content } = req.body

    if (!title || !content) {
        return res.status(400).json({
            message: "Título e conteúdo são obrigatórios."
        })
    }

    next()
}


// Validação usada na atualização
// Pelo menos um dos campos precisa ser enviado
export function validatePostUpdate(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const { title, content } = req.body

    if (title === undefined && content === undefined) {
        return res.status(400).json({
            message: "Informe pelo menos título ou conteúdo para atualizar."
        })
    }

    next()
}