import express, { Request, Response } from "express";
import { pool } from "./Data/db.js";
import { Usuario } from './models/usuario.js';
export const router = express.Router();

// Rota POST /cadastro
router.post("/", async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
      const result = await pool.query<Usuario>(
          `INSERT INTO usuarios (nome, email, senha, created_at, updated_at) 
           VALUES ($1, $2, $3, NOW(), NOW()) 
           RETURNING *`,
          [nome, email, senha]
      );

      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/", async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM usuarios');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
      
      console.log() 
      if(Object.is(result.rows[0],undefined)){
        res.status(404).json({'usuario':"não existe"})
      }
      
      else{ res.status(200).json(result.rows[0]);}
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    
    try {
      const result = await pool.query('DELETE  FROM usuarios  WHERE id = $1 RETURNING *', [id]);
      
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
  });

  router.patch("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const updates = req.body;
  
    if (!id || Object.keys(updates).length === 0) {
       res.status(400).json({ error: "ID e dados de atualização são obrigatórios." });
    }
    if(Object.keys(updates).includes("id")){
      res.status(400).json({ error: "vocẽ n pode mudar o id" });
    }
    try {
      const keys = Object.keys(updates);
      const values = Object.values(updates);
      
      // Construir a cláusula SET, ex: "nome = $1, idade = $2"
      const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  
      // Adiciona o ID como último parâmetro da query
      const result = await pool.query(
        `UPDATE usuarios SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
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
  });






  