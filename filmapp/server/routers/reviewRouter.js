import { Router } from "express";
import { auth } from "../helpers/auth.js";
import {getReview, postReview, removeReview, replaceReview, showReviews, showAvgStars, newReview, getAuth} from '../controllers/ReviewController.js'
import { movieByName, movieDescription, movieCredits } from "../controllers/MovieDetailController.js";
const router = Router()

//router.get('/email/:idUser',auth, getEmail)
router.get('/user/:idMovie/',auth, getReview)
router.post('/post',auth, postReview)
router.delete('/delete/:idMovie/',auth, removeReview)
router.patch('/update',auth, replaceReview)
router.get('/all/:idMovie',showReviews)
router.get('/stars/:idMovie', showAvgStars)
router.post('/new',auth, newReview)

//router.get('/moviebyname',movieByName)
router.get('/moviedesc/:idMovie', movieDescription)
router.get('/checkuser', getAuth)

router.get('/moviecreds/:idMovie', movieCredits)


export default router