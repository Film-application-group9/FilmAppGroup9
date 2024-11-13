import { Router } from "express";
import jwt from 'jsonwebtoken';
import { postRegistration, postLogin } from "../controllers/UserController.js";

const router = Router()

router.post('/register', postRegistration)

router.post('/login', postLogin)

export default router