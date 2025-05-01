import { pool } from "../../Data/db.js";
import { Tag } from "../../models/Tags.js";


export const Delete_Tag = async (req: any, res: any) => {
    const id = req.params.id;
    
    try {
      const result = await pool.query<Tag>('DELETE  FROM tags  WHERE id = $1 RETURNING *', [id]);
      
      console.log() 
      if(Object.is(result.rows[0],undefined)){
        res.status(404).json({'TAG':"não existe"})
      }
      
      else{ 
        
        res.status(200).json({ 
               message: "Tag deletado com sucesso",
               usuario: result.rows[0] 
          })}
    } catch (error) {
      console.error("Erro ao buscar tag:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }