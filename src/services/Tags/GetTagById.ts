import { Request, Response } from 'express';
import Tag from "../../models/schemas/Tags.js"; // ✅ Import padrão

export const GetTagById = async (req: Request, res: Response) => {
    try {
        const tag = await Tag.findById(req.params.id);
        
        if (!tag) {
            return res.status(404).json({ error: "Tag não encontrada" });
        }
        
        res.status(200).json(tag);
    } catch (error) {
        console.error("Erro ao buscar tag:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};