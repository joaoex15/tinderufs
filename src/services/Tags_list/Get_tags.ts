import { pool } from "../../Data/db.js";
import { Tag } from "../../models/Tags.js";


export const Get_Tags = async (req: any, res: any) => {
    try {
        const result = await pool.query<Tag>('SELECT * FROM tags');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
  }