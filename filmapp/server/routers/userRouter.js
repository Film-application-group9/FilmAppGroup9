import { Router } from "express";
import jwt from 'jsonwebtoken';
import { postRegistration, postLogin, deleteUser, getAllUsers } from "../controllers/UserController.js";
import { auth } from "../helpers/auth.js";

const router = Router()

router.post('/register', postRegistration)

router.post('/login', postLogin)

router.delete('/delete/:id',auth, deleteUser)

router.get('/', auth, getAllUsers)

export default router