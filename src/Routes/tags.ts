import express from 'express';
import { tagsController } from '../controllers/tagsController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import { errorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET - Buscar todas tags
router.get('/', tagsController.getTags);

// GET - Buscar tag por ID
router.get('/:id', tagsController.getTagById);

// POST - Criar tag (protegido)
router.post('/', verifyFirebaseToken, tagsController.createTag);

// PUT - Atualizar tag (protegido)
router.put('/:id', verifyFirebaseToken, tagsController.updateTag);

// DELETE - Deletar tag (protegido)
router.delete('/:id', verifyFirebaseToken, tagsController.deleteTag);

// Middleware de erro
router.use(errorHandler);

export default router;