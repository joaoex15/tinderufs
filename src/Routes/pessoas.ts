import express from 'express';
import { pessoaController } from '../controllers/pessoaController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import { errorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET - Buscar todas pessoas (com filtros)
router.get('/', pessoaController.getPessoas);

// GET - Buscar pessoa por ID
router.get('/:id', pessoaController.getPessoaById);

// POST - Criar perfil (protegido)
router.post('/', verifyFirebaseToken, pessoaController.createPessoa);

// PUT - Atualizar pessoa (protegido)
router.put('/:id', verifyFirebaseToken, pessoaController.updatePessoa);

// DELETE - Desativar pessoa (soft delete) (protegido)
router.delete('/:id', verifyFirebaseToken, pessoaController.deletePessoa);

// GET - Buscar perfil do usuário logado
router.get('/profile/me', verifyFirebaseToken, pessoaController.getMyProfile);

// PUT - Atualizar perfil do usuário logado
router.put('/profile/me', verifyFirebaseToken, pessoaController.updateMyProfile);

// Middleware de erro
router.use(errorHandler);

export default router;