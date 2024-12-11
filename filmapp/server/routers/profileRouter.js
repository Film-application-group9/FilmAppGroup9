import { Router } from "express";
import { getProfile, updateProfile, getProfileByUsername } from '../controllers/ProfileController.js';
import { auth } from "../helpers/auth.js";

const router = Router();

router.get('/me', auth, getProfile);
router.get('/:username', getProfileByUsername);
router.patch('/me', auth, updateProfile);

export default router;