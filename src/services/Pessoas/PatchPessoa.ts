import { Request, Response } from 'express';
import Pessoa from "../../models/schemas/Pessoa.js";

export const EditP_pessoa = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updates = req.body;

    // Validações iniciais
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        return res.status(400).json({ error: "Dados de atualização inválidos" });
    }

    if (!id || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "ID e dados de atualização são obrigatórios" });
    }

    // Campos protegidos que não podem ser alterados
    const camposProtegidos = ['_id', 'email', 'createdAt', 'updatedAt'];
    const camposInvalidos = camposProtegidos.filter(field => field in updates);
    
    if (camposInvalidos.length > 0) {
        return res.status(400).json({ 
            error: `Não é permitido alterar: ${camposInvalidos.join(', ')}`
        });
    }

    // Validação de enums
    if (updates.genero && !["masculino", "feminino", "não-binário", "outro"].includes(updates.genero)) {
        return res.status(400).json({ error: "Gênero inválido" });
    }

    if (updates.sexualidade && !["hetero", "gay", "bi", "pan", "assexual", "outro"].includes(updates.sexualidade)) {
        return res.status(400).json({ error: "Sexualidade inválida" });
    }

    try {
        const pessoaAtualizada = await Pessoa.findByIdAndUpdate(
            id,
            { ...updates },
            { new: true, runValidators: true }
        );

        if (!pessoaAtualizada) {
            return res.status(404).json({ error: "Pessoa não encontrada" });
        }

        res.json(pessoaAtualizada);
    } catch (error: any) {
        console.error("Erro ao atualizar pessoa:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({ error: "Email já existe" });
        }
        
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};