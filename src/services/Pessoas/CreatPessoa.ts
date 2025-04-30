import { Request, Response } from 'express';
import { pool } from "../../Data/db.js";
import { Pessoa } from "../../models/Pessoa.js";

export const creatPessoa = async (req: Request, res: Response) => {
    const {
        usuario_id,
        curso,
        data_de_nascimento,
        periodo,
        genero,
        sexualidade,
        descricao,
        ativo = true,
        instagram,
        whatsapp,
        telegram
    } = req.body;
    
    try {
        // Validação do formato da data
        if (data_de_nascimento && !/^\d{4}-\d{2}-\d{2}$/.test(data_de_nascimento)) {
             res.status(400).json({ error: "Formato de data inválido. Use YYYY-MM-DD" });
        }

        const result = await pool.query<Pessoa & { data_de_nascimento: Date }>(
            `INSERT INTO pessoas (
                usuario_id, curso, data_de_nascimento, periodo, genero,
                sexualidade, descricao, ativo, instagram,
                whatsapp, telegram, created_at, updated_at
             ) 
             VALUES ($1, $2, $3::DATE, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()) 
             RETURNING *`,
            [
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
                telegram
            ]
        );

        // Formatar a resposta para retornar apenas a data (sem horário)
        const pessoaFormatada = {
            ...result.rows[0],
            data_de_nascimento: result.rows[0].data_de_nascimento.toISOString().split('T')[0]
        };

        res.status(201).json(pessoaFormatada);
    } catch (error: any) {
        console.error("Erro ao cadastrar pessoa:", error);
        
        if (error.code === '23503') {
             res.status(400).json({ error: "Usuário não encontrado (ID inválido)" });
        }
        
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};