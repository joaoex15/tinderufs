import { pool } from "../../Data/db.js";
import { Pessoa } from "../../models/Pessoa.js";


export const GetPessoas = async (req: any, res: any) => {
    try {
        const result = await pool.query<Pessoa>('SELECT * FROM pessoas');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
  }