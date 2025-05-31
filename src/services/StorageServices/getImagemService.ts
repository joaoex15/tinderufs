import { pool } from '../../Data/db';
import { Imagem } from '../../models/Imagem';

export const getImagensByPessoaId = async (pessoaId: number): Promise<Imagem[]> => {
    const result = await pool.query(
        'SELECT * FROM imagens WHERE pessoa_id = $1',
        [pessoaId]
    );
    return result.rows;
};
