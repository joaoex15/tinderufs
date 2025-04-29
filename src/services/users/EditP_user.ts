import { pool } from "../../Data/db.js";
import { Usuario } from "../../models/usuario.js";


export const EditP_user = async (req: any, res: any) => {
    const id = req.params.id;
    const updates = req.body;
    if (updates === undefined || updates === null) {
        console.log("Updates é undefined ou null");
        return res.status(400).json({ error: "Dados de atualização são obrigatórios" });
    }
    
    if (typeof updates !== 'object' || Array.isArray(updates)) {
        console.log("Updates não é um objeto válido");
        return res.status(400).json({ error: "Dados devem ser um objeto JSON" });
    }
    
    if (!id || Object.keys(updates).length === 0||typeof updates===undefined) {
       res.status(400).json({ error: " dados de atualização são obrigatórios." });
    }
    if(Object.keys(updates).includes("id")){
      res.status(400).json({ error: "vocẽ NÃO pode mudar o id" });
    }
    try {
      const keys = Object.keys(updates);
      const values = Object.values(updates);
      
      // Construir a cláusula SET, ex: "nome = $1, idade = $2"
      const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

      // Adiciona o ID como último parâmetro da query
      const result = await pool.query<Usuario>(
        `UPDATE usuarios SET ${setClause} , updated_at=NOW() WHERE id = $${values.length + 1} RETURNING *`,
        [...values, id]
      );
  
      if (result.rows.length === 0) {
         res.status(404).json({ error: "Usuário não encontrado." });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro interno no servidor." });
    }
  }