import { pool } from "../../Data/db.js";
import { Usuario } from "../../models/usuario.js";


export const Delete_User = async (req: any, res: any) => {
    const id = req.params.id;
    
    try {
      const result = await pool.query<Usuario>('DELETE  FROM usuarios  WHERE id = $1 RETURNING *', [id]);
      
      console.log() 
      if(Object.is(result.rows[0],undefined)){
        res.status(404).json({'usuario':"não existe"})
      }
      
      else{ 
        
        res.status(200).json({ 
               message: "Usuário deletado com sucesso",
               usuario: result.rows[0] 
          })}
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }