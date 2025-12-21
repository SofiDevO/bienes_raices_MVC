import express from 'express';
import { registerForm, register,emailConfirmation, loginForm, forgotPasswordForm } from '../controllers/userController.js';

const router  = express.Router();


router.get('/register', registerForm);
router.post('/register', register);
router.get('/confirm/:token', emailConfirmation);
router.get('/login', loginForm);
router.get('/forgot-password', forgotPasswordForm);

export default router;
