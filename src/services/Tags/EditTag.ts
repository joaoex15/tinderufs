import { Request, Response } from 'express';
import Tag from "../../models/schemas/Tags.js"; // ✅ Import padrão

export const EditTag = async (req: Request, res: Response) => {
    try {
        const { nome } = req.body;

        const tagAtualizada = await Tag.findByIdAndUpdate(
            req.params.id,
            { nome: nome.toLowerCase() },
            { new: true, runValidators: true }
        );

        if (!tagAtualizada) {
            return res.status(404).json({ error: "Tag não encontrada" });
        }

        res.json(tagAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar tag:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};