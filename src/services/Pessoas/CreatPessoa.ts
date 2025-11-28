import { Request, Response } from 'express';
import Pessoa from "../../models/schemas/Pessoa.js";

export const creatPessoa = async (req: Request, res: Response) => {
    const {
        nome,
        curso,
        data_nasc,
        periodo,
        email,
        genero,
        sexualidade,
        descricao,
        ativo = true,
        instagram,
        whatsapp,
        telegram,
        tags = []
    } = req.body;
    
    try {
        // Validações básicas
        if (!nome || !email || !data_nasc || !genero || !sexualidade) {
            return res.status(400).json({ 
                error: "Campos obrigatórios: nome, email, data_nasc, genero, sexualidade" 
            });
        }

        // Validação de data
        const dataNascimento = new Date(data_nasc);
        if (isNaN(dataNascimento.getTime())) {
            return res.status(400).json({ error: "Data de nascimento inválida" });
        }

        // Validação de enums
        const generosValidos = ["masculino", "feminino", "não-binário", "outro"];
        const sexualidadesValidas = ["hetero", "gay", "bi", "pan", "assexual", "outro"];

        if (!generosValidos.includes(genero)) {
            return res.status(400).json({ error: "Gênero inválido" });
        }

        if (!sexualidadesValidas.includes(sexualidade)) {
            return res.status(400).json({ error: "Sexualidade inválida" });
        }

        const novaPessoa = new Pessoa({
            nome,
            curso,
            data_nasc: dataNascimento,
            periodo,
            email: email.toLowerCase(),
            genero,
            sexualidade,
            descricao: descricao || "",
            ativo,
            instagram,
            whatsapp,
            telegram,
            tags
        });

        const pessoaSalva = await novaPessoa.save();
        res.status(201).json(pessoaSalva);
    } catch (error: any) {
        console.error("Erro ao cadastrar pessoa:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({ error: "Email já cadastrado" });
        }
        
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};