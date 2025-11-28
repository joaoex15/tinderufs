import { Request, Response } from 'express';
import Tag from "../../models/schemas/Tags.js"; // ✅ Import padrão

export const CreateTag = async (req: Request, res: Response) => {
    try {
        const { nome } = req.body;

        const tagExistente = await Tag.findOne({ nome: nome.toLowerCase() });
        if (tagExistente) {
            return res.status(400).json({ error: "Tag já existe" });
        }

        const novaTag = new Tag({ nome: nome.toLowerCase() });
        await novaTag.save();

        res.status(201).json(novaTag);
    } catch (error) {
        console.error("Erro ao criar tag:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};