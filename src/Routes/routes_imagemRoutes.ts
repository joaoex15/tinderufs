import { Router } from 'express';
import { deletarImagem, getImagensPorPessoa, uploadImagem } from '../controllers/imagemController';

const router = Router();

router.post('/', uploadImagem);
router.get('/:pessoa_id', getImagensPorPessoa);
router.delete('/:id', deletarImagem);

export default router;
