import { Request, Response } from 'express';
import Imagem from "../../models/schemas/Imagem.js"; // ✅ Import padrão

export const GetImagemById = async (req: Request, res: Response) => {
    try {
        const imagem = await Imagem.findById(req.params.id);
        
        if (!imagem) {
            return res.status(404).json({ error: "Imagem não encontrada" });
        }
        
        res.status(200).json(imagem);
    } catch (error) {
        console.error("Erro ao buscar imagem:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};