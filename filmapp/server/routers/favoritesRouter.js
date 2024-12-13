import { Router } from "express";
import { postUserFavorite, getUserFavorite, deleteUserFavorite } from "../controllers/FavoritesController.js";
const router = Router()

router.post('/', postUserFavorite)

router.get('/:userId', getUserFavorite)

router.delete('/delete/:userId/:idMovie', deleteUserFavorite)


export default router