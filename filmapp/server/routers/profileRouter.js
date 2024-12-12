import { Router } from "express";
import { getProfile, getProfileByIdOrUsername } from '../controllers/ProfileController.js';
import { auth } from "../helpers/auth.js";

const router = Router();

router.get('/me', auth, getProfile);
router.get('/:username', getProfileByIdOrUsername); 

export default router;