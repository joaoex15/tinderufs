import { pool } from "../../Data/db.js";
import { Usuario } from "../../models/usuario.js";


export const creatUser = async (req: any, res: any) => {
    const { nome, email, senha } = req.body;

    try {
        const result = await pool.query<Usuario>(
            `INSERT INTO usuarios (nome, email, senha, created_at, updated_at) 
             VALUES ($1, $2, $3, NOW(), NOW()) 
             RETURNING *`,
            [nome, email, senha]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}