import jwt from "jsonwebtoken"

interface Payload {
    id: number
    email: string
}


// gera um token
export function generateToken(payload: Payload) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN)
    })
}


// verifica se o token é válido
export function verifyToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!)
    } catch {
        return null
    }
}
