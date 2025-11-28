import { Request, Response } from 'express';
import Tag from "../../models/schemas/Tags.js"; // ✅ Import padrão

export const DeleteTag = async (req: Request, res: Response) => {
    try {
        const tagDeletada = await Tag.findByIdAndDelete(req.params.id);
        
        if (!tagDeletada) {
            return res.status(404).json({ error: "Tag não encontrada" });
        }
        
        res.status(200).json({ 
            message: "Tag deletada com sucesso",
            tag: tagDeletada 
        });
    } catch (error) {
        console.error("Erro ao deletar tag:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};