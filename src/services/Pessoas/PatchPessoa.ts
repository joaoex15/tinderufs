import { Request, Response } from 'express';
import { pool } from "../../Data/db.js";
import { Pessoa } from "../../models/Pessoa.js";

export const EditP_pessoa = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updates = req.body;

    // Validações iniciais
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
         res.status(400).json({ error: "Dados de atualização inválidos" });
    }

    if (!id || Object.keys(updates).length === 0) {
         res.status(400).json({ error: "ID e dados de atualização são obrigatórios" });
    }

    // Campos protegidos que não podem ser alterados
    const camposProtegidos = ['id', 'usuario_id', 'data_de_nascimento'];
    const camposInvalidos = camposProtegidos.filter(field => field in updates);
    
    if (camposInvalidos.length > 0) {
         res.status(400).json({ 
            error: `Não é permitido alterar: ${camposInvalidos.join(', ')}`
        });
    }

    try {
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        
        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

        const result = await pool.query<Pessoa>(
            `UPDATE pessoas 
             SET ${setClause}, updated_at = NOW() 
             WHERE usuario_id = $${keys.length + 1} 
             RETURNING 
                id,
                usuario_id,
                curso,
                data_de_nascimento,
                periodo,
                genero,
                sexualidade,
                descricao,
                ativo,
                instagram,
                whatsapp,
                telegram,
                created_at,
                updated_at`,
            [...values, id]
        );

        if (result.rows.length === 0) {
             res.status(404).json({ error: "Pessoa não encontrada" });
        }

        // Formata a data para retornar sem o horário
        const pessoaFormatada = {
            ...result.rows[0],
            data_de_nascimento: result.rows[0].data_de_nascimento 
                ? result.rows[0].data_de_nascimento.toISOString().split('T')[0]
                : null
        };

        res.json(pessoaFormatada);
    } catch (error: any) {
        console.error("Erro ao atualizar pessoa:", error);
        
        if (error.code === '23505') {
             res.status(409).json({ error: "Violação de constraint única" });
        }
        
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};