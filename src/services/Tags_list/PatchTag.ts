import { Request, Response } from 'express';
import { pool } from "../../Data/db.js";
import { Tag } from "../../models/Tags.js";

export const EditP_Tag = async (req: Request, res: Response) => {
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
    const camposProtegidos = ['id', 'created_at'];
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

        const result = await pool.query<Tag>(
            `UPDATE tags 
             SET ${setClause}, updated_at = NOW() 
             WHERE id = $${keys.length + 1} 
             RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) {
             res.status(404).json({ error: "Tag não encontrada" });
        }

         res.json(result.rows[0]);

    } catch (error: any) {
        console.error("Erro ao atualizar tag:", error);
        
        // Erro de violação de constraint única (nome + categoria)
        if (error.code === '23505' && error.constraint?.includes('nome_categoria')) {
             res.status(409).json({ 
                error: "Já existe uma tag com este nome e categoria",
                details: {
                    nome: updates.nome,
                    categoria: updates.categoria
                }
            });
        }
        
        // Erro de violação de constraint única genérica
        if (error.code === '23505') {
             res.status(409).json({ 
                error: "Violação de restrição única",
                details: error.detail
            });
        }

        // Erro de valor nulo
        if (error.code === '23502') {
             res.status(400).json({
                error: "Campo obrigatório não informado",
                field: error.column
            });
        }

         res.status(500).json({ 
            error: "Erro interno no servidor",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};