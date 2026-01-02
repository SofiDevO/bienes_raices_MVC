import express from 'express';
import { emailConfirmation, forgotPasswordForm, loginForm, register, registerForm, resetPassword } from '../controllers/userController.js';

const router  = express.Router();


router.get('/register', registerForm);
router.post('/register', register);
router.get('/confirm/:token', emailConfirmation);
router.get('/login', loginForm);
router.get('/forgot-password', forgotPasswordForm);
router.post('/reset-password', resetPassword);

export default router;
