import { Router } from "express"
import { PostController } from "../controllers/PostController"
import { authMiddleware } from "../middlewares/authMiddleware"
import { validatePost, validatePostUpdate } from "../middlewares/validatePost"

const router = Router()
const postController = new PostController()


// Listar todos os posts
router.get(
    "/",
    postController.list.bind(postController)
)


// Buscar um post pelo id
router.get(
    "/:id",
    postController.getById.bind(postController)
)


// Criar post
// Precisa estar autenticado
router.post(
    "/",
    authMiddleware,
    validatePost,
    postController.create.bind(postController)
)


// Atualizar post
// O JWT identifica o usuário
// O Service verifica se ele é o dono do post
router.put(
    "/:id",
    authMiddleware,
    validatePostUpdate,
    postController.update.bind(postController)
)


// Excluir post
// O JWT identifica o usuário
// O Service verifica se ele é o dono do post
router.delete(
    "/:id",
    authMiddleware,
    postController.delete.bind(postController)
)


export default router