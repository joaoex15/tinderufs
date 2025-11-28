import { Request, Response } from 'express';
import Imagem from "../../models/schemas/Imagem.js"; // ✅ Import padrão

export const UploadImagem = async (req: Request, res: Response) => {
    try {
        const { pessoa_id, caminho_arquivo } = req.body;

        const novaImagem = new Imagem({
            pessoa_id,
            caminho_arquivo
        });

        await novaImagem.save();

        res.status(201).json(novaImagem);
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};