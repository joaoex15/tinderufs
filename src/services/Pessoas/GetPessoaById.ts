import { pool } from "../../Data/db.js";
import { Pessoa } from "../../models/Pessoa.js";


export const GetPessoaById = async (req: any, res: any) => {
    const id = req.params.id;
    
    try {
      const result = await pool.query<Pessoa>('SELECT * FROM Pessoas WHERE usuario_id = $1', [id]);
      
      console.log() 
      if(Object.is(result.rows[0],undefined)){
        res.status(404).json({'Pessoa':"não existe"})
      }
      
      else{ res.status(200).json(result.rows[0]);}
    } catch (error) {
      console.error("Erro ao buscar pessoa:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
