import { Router } from "express";
import { postUserFavorite } from "../controllers/FavoritesController.js";
const router = Router()

router.post('/', postUserFavorite)

export default router