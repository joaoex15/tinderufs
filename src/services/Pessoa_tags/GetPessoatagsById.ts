import { pool } from "../../Data/db.js";
import { Usuario } from "../../models/usuario.js";


export const GetPessoaTagsById = async (req: any, res: any) => {
    const id = req.params.id;
    
    try {
      const result = await pool.query<Usuario>('SELECT * FROM pessoa_tags WHERE id = $1', [id]);
      
      console.log() 
      if(Object.is(result.rows[0],undefined)){
        res.status(404).json({'pessoa_tags':"não existe"})
      }
      
      else{ res.status(200).json(result.rows[0]);}
    } catch (error) {
      console.error("Erro ao buscar pessoa_tags:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
