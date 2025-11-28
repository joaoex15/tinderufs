import express from 'express';
import { imagemController } from '../controllers/imagemController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import { errorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET - Buscar todas imagens (com paginação)
router.get('/', imagemController.getAllImagens);

// GET - Buscar imagem por ID
router.get('/:id', imagemController.getImagemById);

// GET - Buscar imagens por pessoa
router.get('/pessoa/:pessoaId', imagemController.getImagensByPessoa);

// POST - Upload de imagem (protegido)
router.post('/', verifyFirebaseToken, imagemController.uploadImagem);

// PUT - Atualizar imagem (protegido)
router.put('/:id', verifyFirebaseToken, imagemController.updateImagem);

// DELETE - Deletar imagem (protegido)
router.delete('/:id', verifyFirebaseToken, imagemController.deleteImagem);

// DELETE - Deletar todas imagens de uma pessoa (protegido)
router.delete('/pessoa/:pessoaId', verifyFirebaseToken, imagemController.deleteImagensByPessoa);

// Middleware de erro
router.use(errorHandler);

export default router;