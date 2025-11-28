import { Request, Response } from 'express';
import Pessoa from "../../models/schemas/Pessoa.js";

export const GetPessoaById = async (req: Request, res: Response) => {
    const id = req.params.id;
    
    try {
        const pessoa = await Pessoa.findById(id);
        
        if (!pessoa) {
            return res.status(404).json({ error: "Pessoa não encontrada" });
        }
        
        res.status(200).json(pessoa);
    } catch (error) {
        console.error("Erro ao buscar pessoa:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}