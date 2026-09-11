import { AppDataSource } from "../config/data-source"
import { User } from "../models/User"
import bcrypt from "bcrypt"
import { omitPassword } from "../utils/omitPassword"
import { generateToken } from "../utils/jwt"

// A camada Service é responsável por chamar os métodos de Repository e cuidar das validações das nossas regras de negócio
// Como não estamos usando uma camada Repository separada, o Service acessa o TypeORM diretamente aqui dentro

// repo é um objeto do TypeORM que contém todas as funções que precisamos para trabalhar com o banco, ligado a uma entidade específica (nesse caso, User)
const repo = AppDataSource.getRepository(User)

// Aqui estamos criando uma classe de erro que extende a classe Error
// Isso é para permitir que o errorHandler identifique o tipo de erro de uma forma mais clara
export class NotFoundError extends Error {}
export class UnauthorizedError extends Error {}

export const UserService = {

    // O Controller NÃO PODE se comunicar diretamente com o banco, e sim com o Service
    async listAll() {
        // o método find() vem do TypeORM. Ele procura algo em uma tabela
        // ele aceita como parâmetro um objeto com opções para esta busca
        // nesse nosso caso, estamos buscando também os posts relacionados com este usuário
        const users = await repo.find({ relations: ["posts"] })
        return users.map(user => omitPassword(user))
    },

    async getById(id: number) {
        const user = await repo.findOne({ where: { id }, relations: ["posts"] })

        // Se não encontrarmos um user com esse id, ele não existe
        if (!user) {
            throw new NotFoundError("Usuário não encontrado!")
        }

        return omitPassword(user)
    },

    async create(data: { name: string, email: string, password: string }) {
        // Este método gera uma senha criptografada
        const hashedPassword = await bcrypt.hash(data.password, 10)

        // cria o usuário
        const user = repo.create({
            name: data.name,
            email: data.email,
            password: hashedPassword
        })

        // salva ele no banco
        const savedUser = await repo.save(user)

        // Retornamos o usuário sem a senha
        return omitPassword(savedUser)
    },

    async login(data: { email: string, password: string }) {
        // Primeiro buscamos o usuário pelo email
        // Esse findOne por email será usado no login
        const user = await repo.findOne({ where: { email: data.email } })

        // Se não encontrou usuário com esse email, lançamos erro
        if (!user) {
            throw new NotFoundError("Usuário não encontrado!")
        }

        // Agora comparamos a senha enviada com a senha criptografada no banco
        const passwordIsValid = await bcrypt.compare(data.password, user.password)

        // Se a senha estiver errada, lançamos erro de autorização
        if (!passwordIsValid) {
            throw new UnauthorizedError("Senha inválida!")
        }

        // Se chegou até aqui, email e senha estão corretos
        // Então podemos gerar o token JWT
        const token = generateToken({
            id: user.id,
            email: user.email
        })

        // Retornamos o usuário sem senha e o token
        return {
            user: omitPassword(user),
            token
        }
    },

    async update(id: number, data: { name?: string, email?: string, password?: string }) {
        // encontra o usuário pelo id
        const user = await repo.findOne({ where: { id } })

        if (!user) {
            throw new NotFoundError("Usuário não encontrado!")
        }

        // Só vamos alterar/atualizar os campos que vierem
        if (data.name) user.name = data.name
        if (data.email) user.email = data.email

        // Se vier uma senha nova, a gente precisa criptografar ela de novo
        if (data.password) user.password = await bcrypt.hash(data.password, 10)

        // Depois de tudo isso acima, salvamos de novo
        // Como o user já possui id, o TypeORM entende que é atualização, não novo cadastro
        const updatedUser = await repo.save(user)

        // Retorna o usuário sem a senha
        return omitPassword(updatedUser)
    },

    async delete(id: number) {
        const result = await repo.delete(id)

        if (result.affected === 0) {
            throw new NotFoundError("Usuário não encontrado!")
        }
    }
}
