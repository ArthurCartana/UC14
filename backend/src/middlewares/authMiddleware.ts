import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../utils/jwt"

// Middleware para proteger rotas que exigem autenticação
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // Pega o header de autorização da requisição
    const authHeader = req.headers.authorization

    // Se não houver header, retorna erro 401
    if (!authHeader) {
        return res.status(401).json({
            message: "Token não fornecido."
        })
    }

    // O token vem neste formato:
    // Authorization: Bearer tokenAqui
    const parts = authHeader.split(" ")

    // Se não tiver exatamente duas partes, está mal formatado
    if (parts.length !== 2) {
        return res.status(401).json({
            message: "Token mal formatado."
        })
    }

    const [scheme, token] = parts

    // A primeira parte precisa ser Bearer
    if (scheme !== "Bearer") {
        return res.status(401).json({
            message: "Formato do token inválido."
        })
    }

    // Verifica se o token é válido
    const decoded = verifyToken(token)

    // Se o token for inválido ou expirado, bloqueia
    if (!decoded) {
        return res.status(401).json({
            message: "Token inválido ou expirado."
        })
    }

    // Guardamos os dados decodificados dentro do req
    // Assim, outros controllers poderiam saber quem é o usuário logado
    ;(req as any).user = decoded

    // Se chegou até aqui, está tudo certo
    // Então deixamos a requisição seguir
    next()
}
