import { Router } from "express"
import { UserController } from "../controllers/UserController"
import { validateUser } from "../middlewares/validateUser"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()
const userController = new UserController()

// Cadastrar usuário fica público
// Afinal, se a pessoa ainda não tem conta, ela precisa conseguir se cadastrar
router.post("/", validateUser, userController.create.bind(userController))

// Daqui para baixo, as rotas exigem token
router.get("/", authMiddleware, userController.list.bind(userController))
router.get("/:id", authMiddleware, userController.getById.bind(userController))
router.put("/", authMiddleware, userController.update.bind(userController))
router.delete("/:id", authMiddleware, userController.delete.bind(userController))

export default router
