import { pool } from "../../Data/db.js";
import { Tag } from "../../models/Tags.js";


export const Get_TagById = async (req: any, res: any) => {
    const id = req.params.id;
    
    try {
      const result = await pool.query<Tag>('SELECT * FROM Tags WHERE id = $1', [id]);
      
      console.log() 
      if(Object.is(result.rows[0],undefined)){
        res.status(404).json({'Tag':"não existe"})
      }
      
      else{ res.status(200).json(result.rows[0]);}
    } catch (error) {
      console.error("Erro ao buscar Tag:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
}
