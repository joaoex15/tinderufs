import { Request, Response } from 'express';
import Tag from "../../models/schemas/Tags.js"; // ✅ Import padrão

export const GetTags = async (req: Request, res: Response) => {
    try {
        const tags = await Tag.find().sort({ nome: 1 });
        res.status(200).json(tags);
    } catch (error) {
        console.error("Erro ao buscar tags:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};