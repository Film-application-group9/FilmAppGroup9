import {Router} from "express"
import { naytosajat } from "../models/showtimes.js"

const router = Router()

router.get('/showtimes', naytosajat)


export default router