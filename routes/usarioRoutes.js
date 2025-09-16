import express from 'express';
import { registerForm,loginForm, forgotPasswordForm } from '../controllers/usuarioController.js';

const router  = express.Router();


router.get('/register', registerForm);
router.get('/login', loginForm);
router.get('/forgot-password', forgotPasswordForm);

export default router;
