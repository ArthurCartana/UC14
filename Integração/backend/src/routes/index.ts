import { Router } from "express"
import userRoutes from "./user.routes"
import authRoutes from "./auth.routes"
import postRoutes from "./post.routes"

const router = Router()

router.use("/users", userRoutes)
router.use("/auth", authRoutes)
router.use("/post", postRoutes)

export default router
