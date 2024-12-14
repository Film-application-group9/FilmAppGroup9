import { Router } from "express";
import { postUserFavorite, getUserFavorite, deleteUserFavorite } from "../controllers/FavoritesController.js";

const router = Router();

router.post('/', postUserFavorite);
router.get('/:idUser', getUserFavorite); 
router.delete('/delete/:idUser/:idMovie', deleteUserFavorite);

export default router;