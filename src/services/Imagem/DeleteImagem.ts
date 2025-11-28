import { Request, Response } from 'express';
import Imagem from "../../models/schemas/Imagem.js"; // ✅ Import padrão

export const DeleteImagem = async (req: Request, res: Response) => {
    try {
        const imagemDeletada = await Imagem.findByIdAndDelete(req.params.id);
        
        if (!imagemDeletada) {
            return res.status(404).json({ error: "Imagem não encontrada" });
        }
        
        res.status(200).json({ 
            message: "Imagem deletada com sucesso",
            imagem: imagemDeletada 
        });
    } catch (error) {
        console.error("Erro ao deletar imagem:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};