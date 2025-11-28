import express from 'express';
import { usuarioController } from '../controllers/usuarioController.js';
import { verifyFirebaseToken } from '..//middleware/authMiddleware.js';
import { errorHandler } from '../controllers/middleware/errorHandler.js';

const router = express.Router();

// GET - Buscar perfil do usuário logado (Firebase)
router.get('/profile', verifyFirebaseToken, usuarioController.getUserProfile);

// PUT - Atualizar perfil do usuário logado
router.put('/profile', verifyFirebaseToken, usuarioController.updateUserProfile);

// DELETE - Deletar conta do usuário logado
router.delete('/profile', verifyFirebaseToken, usuarioController.deleteUser);

// GET - Estatísticas do usuário
router.get('/stats', verifyFirebaseToken, usuarioController.getUserStats);

// Middleware de erro
router.use(errorHandler);

export default router;