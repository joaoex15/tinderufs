import { pool } from "../../Data/db.js";
import { PessoaTag } from "../../models/Pessoa_tags.js";


export const Get_PessoaTags = async (req: any, res: any) => {
    try {
        const result = await pool.query<PessoaTag>('SELECT * FROM pessoa_tags');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
  }