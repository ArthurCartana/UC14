import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from 'dotenv'
import { User } from "../models/User"
import { Post } from "../models/Post"


// sempre use isso quando for trabalhar com dotenv
// ele carrega as informações do .env para o objeto process.env
dotenv.config()

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // Em desenvolvimento facilita, pois cria/atualiza as tabelas automaticamente
    // Em produção, o ideal é usar migrations em vez de synchronize
    synchronize: true,
    logging: false,
    entities: [User, Post]
})
 