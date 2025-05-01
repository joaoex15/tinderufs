import { pool } from "../../Data/db.js";
import { PessoaTag } from "../../models/Pessoa_tags.js";


export const DeletePessoatag = async (req: any, res: any) => {
    const id = req.params.id;
    
    try {
      const result = await pool.query<PessoaTag>('DELETE  FROM pessoa_tags  WHERE usuario_id = $1 RETURNING *', [id]);
      
      console.log() 
      if(Object.is(result.rows[0],undefined)){
        res.status(404).json({'pessoa_tags ':"não existe"})
      }
      
      else{ 
        
        res.status(200).json({ 
               message: "pessoa_tags deletado com sucesso",
               usuario: result.rows[0] 
          })}
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }