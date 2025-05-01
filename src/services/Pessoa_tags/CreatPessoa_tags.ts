import { pool } from "../../Data/db.js";
import { PessoaTag } from "../../models/Pessoa_tags.js";

export const CreatPessoaTag = async (req: any, res: any) => {
    const { usuario_id, tag_ids } = req.body;

    // Validações básicas melhoradas
    if (!usuario_id || typeof usuario_id !== 'number') {
        return res.status(400).json({ 
            error: "ID do usuário é obrigatório e deve ser um número",
            field: "usuario_id"
        });
    }

    if (!tag_ids || !Array.isArray(tag_ids) || tag_ids.length === 0) {
        return res.status(400).json({ 
            error: "tag_ids deve ser um array não vazio de números",
            field: "tag_ids"
        });
    }

    // Verifica se todos os elementos são números
    if (tag_ids.some(id => typeof id !== 'number')) {
        return res.status(400).json({ 
            error: "Todos os IDs das tags devem ser números",
            invalid_ids: tag_ids.filter(id => typeof id !== 'number')
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Verifica se o usuário existe
        const userExists = await client.query(
            'SELECT 1 FROM usuarios WHERE id = $1', 
            [usuario_id]
        );
        
        if (userExists.rowCount === 0) {
            return res.status(404).json({ 
                error: "Usuário não encontrado",
                details: `Nenhum usuário com ID ${usuario_id} foi encontrado`
            });
        }

        // 2. Identifica exatamente quais tags não existem
        const existingTags = await client.query(
            `SELECT id FROM tags WHERE id = ANY($1::int[])`,
            [tag_ids]
        );
        
        const existingIds = existingTags.rows.map(row => row.id);
        const missingTags = tag_ids.filter(id => !existingIds.includes(id));

        if (missingTags.length > 0) {
            return res.status(404).json({ 
                error: "Algumas tags não existem",
                details: {
                    tags_faltando: missingTags,
                    tags_validas: existingIds
                }
            });
        }

        // 3. Remove duplicatas do array
        const uniqueTagIds = [...new Set(tag_ids)];

        // 4. Insere ou atualiza o registro
        const result = await client.query<PessoaTag>(
            `INSERT INTO pessoa_tags (usuario_id, tag_ids, created_at, updated_at)
             VALUES ($1, $2, NOW(), NOW())
             ON CONFLICT (usuario_id) 
             DO UPDATE SET 
                tag_ids = array_cat(
                    array_remove(pessoa_tags.tag_ids, NULL),  -- Remove NULLs se existirem
                    $2::int[]
                ),
                updated_at = NOW()
             RETURNING *`,
            [usuario_id, uniqueTagIds]
        );

        await client.query('COMMIT');

        return res.status(201).json({
            success: true,
            message: "Tags associadas ao usuário com sucesso",
            data: result.rows[0],
            tags_adicionadas: uniqueTagIds
        });

    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error("Erro ao associar tags:", error);
        
        if (error.code === '23503') { // Foreign key violation
            return res.status(400).json({ 
                error: "Relação inválida",
                details: error.detail
            });
        }

        return res.status(500).json({ 
            error: "Erro interno no servidor",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        client.release();
    }
};