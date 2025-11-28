import { Request, Response } from 'express';
import Imagem from "../../models/schemas/Imagem.js"; // ✅ Import padrão

export const GetImagensByPessoa = async (req: Request, res: Response) => {
    try {
        const imagens = await Imagem.find({ 
            pessoa_id: req.params.pessoaId 
        }).sort({ createdAt: -1 });

        res.status(200).json(imagens);
    } catch (error) {
        console.error("Erro ao buscar imagens:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};