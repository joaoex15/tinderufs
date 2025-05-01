import { pool } from "../../Data/db.js";
import { Tag } from "../../models/Tags.js";


export const CreatTag = async (req: any, res: any) => {
    const { nome, categoria  } = req.body;

    try {
        const result = await pool.query<Tag>(
            `INSERT INTO  tags ( nome, categoria ,created_at,updated_at) 
             VALUES ($1, $2,  NOW(), NOW()) 
             RETURNING *`,
            [nome, categoria]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao cadastrar Tag:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}