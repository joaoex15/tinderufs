import express from 'express';
import { authController } from '../controllers/authController.js';
import { errorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Rota pública para criar conta
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas
router.post('/verify-token', authController.verifyToken);
router.post('/reset-password', authController.resetPassword);
router.post('/update-profile', authController.updateProfile);

// Middleware de erro
router.use(errorHandler);

export default router;