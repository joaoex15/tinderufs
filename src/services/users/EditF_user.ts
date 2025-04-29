import { Request, Response } from 'express';
import { pool } from "../../Data/db.js";
import { Usuario } from "../../models/usuario";

export const EditF_user = async (req: Request, res: Response) => {
    const id = req.params.id;
    const newData = req.body;

    // Validações (mais rigorosas que no PATCH)
    if (!id) {
         res.status(400).json({ error: "ID é obrigatório" });
    }

    if (!newData || typeof newData !== 'object' || Array.isArray(newData)) {
         res.status(400).json({ error: "Dados completos são obrigatórios" });
    }

    // Campos obrigatórios para PUT (exemplo)
    const requiredFields = ['nome', 'email', 'senha'];
    const missingFields = requiredFields.filter(field => !(field in newData));
    
    if (missingFields.length > 0) {
         res.status(400).json({ 
            error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`
        });
    }

    try {
        // PUT substitui TODOS os campos (diferente do PATCH)
        newData.updated_at = new Date().toISOString(); // Adiciona o timestamp atual automaticamente

        const result = await pool.query<Usuario>(
            `UPDATE usuarios 
             SET nome = $1, email = $2, senha = $3, updated_at = NOW() 
             WHERE id = $4 
             RETURNING id, nome, email, created_at ,updated_at `,
            [newData.nome, newData.email, newData.senha, id]
        );

        if (result.rows.length === 0) {
             res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao atualizar usuário (PUT):", error);
        
       
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};