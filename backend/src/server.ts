import "reflect-metadata"
import "dotenv/config"
import express from "express"
import cors from "cors"
import { AppDataSource } from "./config/data-source"
import routes from "./routes"
import { errorHandler } from "./middlewares/errorHandler"

const app = express()

app.use(cors())
app.use(express.json())

app.use(routes)

// O errorHandler precisa ser o ÚLTIMO middleware, depois de todas as rotas
app.use(errorHandler)

const PORT = process.env.PORT || 3000

AppDataSource.initialize()
    .then(() => {
        console.log("Conexão com o banco de dados estabelecida.")

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error("Erro ao conectar com o banco de dados:", error)
    })
