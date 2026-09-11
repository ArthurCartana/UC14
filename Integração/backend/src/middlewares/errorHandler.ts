import { NextFunction, Request, Response } from "express"
import { NotFoundError, UnauthorizedError } from "../services/UserService"

// Esse middleware vai formatar cada resposta de erro.
// Ao invés de cada controller ter que pegar um erro e formatar a mensagem bonitinha, ele faz isso pra todo mundo.
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {

    // Antes de mais nada, a gente mostra o erro "na forma original" dele pra debugar
    console.error("Erro capturado pelo errorHandler: ", error)

    // Erro para quando alguma coisa não foi encontrada
    if (error instanceof NotFoundError) {
        return res.status(404).json({
            message: error.message
        })
    }

    // Erro para quando o usuário não tem autorização
    // Exemplo: senha inválida
    if (error instanceof UnauthorizedError) {
        return res.status(401).json({
            message: error.message
        })
    }

    // Esse tal de 'ER_DUP_ENTRY' é específico do MySQL:
    // ele acontece quando a gente tenta salvar algo que já existe e tem UNIQUE
    // exemplo: criar um usuário com um email que já existe
    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            message: "Registro duplicado (email já existente)."
        })
    }

    // Se for qualquer outro erro que a gente não previu, vira um 500 genérico
    return res.status(500).json({
        message: "Erro interno do servidor. Traduzindo: DEU RUIM, GURIZADA!"
    })
}
 