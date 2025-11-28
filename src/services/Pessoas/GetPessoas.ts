import { Request, Response } from 'express';
import Pessoa from "../../models/schemas/Pessoa.js";

export const GetPessoas = async (req: Request, res: Response) => {
    try {
        const pessoas = await Pessoa.find({ ativo: true });
        res.status(200).json(pessoas);
    } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}