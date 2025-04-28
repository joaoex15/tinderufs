import { pool } from "../../Data/db.js";
import { Usuario } from "../../models/usuario";


export const Get_User = async (req: any, res: any) => {
    try {
        const result = await pool.query<Usuario>('SELECT * FROM usuarios');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
  }