import express from 'express';
import { matchController } from '../controllers/matchController.js';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import { errorHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET - Buscar matches do usuário
router.get('/my-matches', verifyFirebaseToken, matchController.getMyMatches);

// GET - Buscar match específico
router.get('/:id', verifyFirebaseToken, matchController.getMatchById);

// POST - Criar match (swipe)
router.post('/', verifyFirebaseToken, matchController.createMatch);

// PUT - Atualizar match (ex: confirmar match)
router.put('/:id', verifyFirebaseToken, matchController.updateMatch);

// DELETE - Deletar match (unmatch)
router.delete('/:id', verifyFirebaseToken, matchController.deleteMatch);

// GET - Buscar recomendações
router.get('/suggestions/recommendations', verifyFirebaseToken, matchController.getRecommendations);

// POST - Like/swipe direito
router.post('/:pessoaId/like', verifyFirebaseToken, matchController.likePessoa);

// POST - Dislike/swipe esquerdo
router.post('/:pessoaId/dislike', verifyFirebaseToken, matchController.dislikePessoa);

// Middleware de erro
router.use(errorHandler);

export default router;