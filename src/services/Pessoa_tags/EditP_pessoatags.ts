import { pool } from "../../Data/db.js";
import { PessoaTag } from "../../models/Pessoa_tags.js";

export const EditP_pessoaTags = async (req: any, res: any) => {
    const usuario_id = req.params.id;
    const { tag_ids } = req.body;

    // Validações básicas
    if (!usuario_id) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    if (!tag_ids || !Array.isArray(tag_ids)) {
        return res.status(400).json({ error: "tag_ids deve ser um array de números" });
    }

    try {
        // Verifica quais tags existem
        const tagsCheck = await pool.query(
            `SELECT id FROM tags WHERE id = ANY($1)`,
            [tag_ids]
        );
        
        const existingTags = tagsCheck.rows.map(row => row.id);
        const missingTags = tag_ids.filter(id => !existingTags.includes(id));

        if (missingTags.length > 0) {
            return res.status(400).json({ 
                error: "Algumas tags não existem",
                missing_tags: missingTags,
                existing_tags: existingTags
            });
        }

        // Atualiza o registro
        const result = await pool.query<PessoaTag>(
            `UPDATE pessoa_tags 
             SET tag_ids = $1, updated_at = NOW()
             WHERE usuario_id = $2
             RETURNING tag_ids`,
            [tag_ids, usuario_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Registro não encontrado para este usuário" });
        }

        return res.json(result.rows[0].tag_ids);

    } catch (error: any) {
        console.error("Erro ao atualizar tags:", error);
        
        if (error.code === '23503') {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};