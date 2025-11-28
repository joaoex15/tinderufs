import { Request, Response } from 'express';
import Pessoa from "../models/schemas/Pessoa.js";
import { AppError } from "./middleware/errorHandler.js";

// Helper para verificar se é erro de validação do Mongoose
const isValidationError = (error: any): error is { name: string; errors: any } => {
  return error.name === 'ValidationError';
};

// Helper para verificar se é erro de duplicata
const isDuplicateError = (error: any): error is { code: number; keyValue: any } => {
  return error.code === 11000;
};

export const pessoaController = {
  // CREATE - Criar perfil de pessoa
  async createPessoa(req: Request, res: Response) {
    try {
      const {
        nome, email, data_nasc, genero, sexualidade,
        curso, periodo, descricao, instagram, whatsapp, telegram, tags
      } = req.body;

      // Validações obrigatórias
      const camposObrigatorios = ['nome', 'email', 'data_nasc', 'genero', 'sexualidade'];
      const camposFaltantes = camposObrigatorios.filter(campo => !req.body[campo]);
      
      if (camposFaltantes.length > 0) {
        throw new AppError(`Campos obrigatórios: ${camposFaltantes.join(', ')}`, 400);
      }

      // Validação de email único
      const emailExistente = await Pessoa.findOne({ email: email.toLowerCase() });
      if (emailExistente) {
        throw new AppError('Email já cadastrado', 409);
      }

      const novaPessoa = new Pessoa({
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        data_nasc: new Date(data_nasc),
        genero,
        sexualidade,
        curso: curso?.trim() || null,
        periodo: periodo?.trim() || null,
        descricao: descricao?.trim() || '',
        instagram: instagram?.trim(),
        whatsapp: whatsapp?.trim(),
        telegram: telegram?.trim(),
        tags: tags || [],
        ativo: true
      });

      await novaPessoa.save();

      res.status(201).json({
        success: true,
        message: 'Perfil criado com sucesso',
        data: novaPessoa,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      // Tratamento específico para erros conhecidos
      if (error instanceof AppError) {
        throw error;
      }
      
      if (isValidationError(error)) {
        throw new AppError('Dados de entrada inválidos', 400, error.errors);
      }
      
      if (isDuplicateError(error)) {
        throw new AppError('Email já cadastrado', 409);
      }
      
      throw new AppError('Erro ao criar perfil', 500);
    }
  },

  // GET ALL - Buscar todas pessoas (com filtros)
  async getPessoas(req: Request, res: Response) {
    try {
      const { ativo, genero, curso } = req.query;
      
      const filter: any = {};
      if (ativo !== undefined) filter.ativo = ativo === 'true';
      if (genero) filter.genero = genero;
      if (curso) filter.curso = new RegExp(curso as string, 'i');

      const pessoas = await Pessoa.find(filter)
        .sort({ nome: 1 })
        .select('-__v');

      res.status(200).json({
        success: true,
        message: 'Pessoas recuperadas com sucesso',
        data: pessoas,
        count: pessoas.length,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      throw new AppError('Erro ao buscar pessoas', 500);
    }
  },

  // GET BY ID - Buscar pessoa por ID
  async getPessoaById(req: Request, res: Response) {
    try {
      const pessoa = await Pessoa.findById(req.params.id);

      if (!pessoa) {
        throw new AppError('Pessoa não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Pessoa encontrada',
        data: pessoa,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao buscar pessoa', 500);
    }
  },

  // UPDATE - Atualizar pessoa
  async updatePessoa(req: Request, res: Response) {
    try {
      const updates = req.body;
      
      // Campos que não podem ser atualizados
      const camposProtegidos = ['_id', 'email', 'createdAt', 'updatedAt'];
      const camposInvalidos = camposProtegidos.filter(field => field in updates);
      
      if (camposInvalidos.length > 0) {
        throw new AppError(`Não é permitido alterar: ${camposInvalidos.join(', ')}`, 400);
      }

      const pessoaAtualizada = await Pessoa.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      );

      if (!pessoaAtualizada) {
        throw new AppError('Pessoa não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Pessoa atualizada com sucesso',
        data: pessoaAtualizada,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      
      if (isValidationError(error)) {
        throw new AppError('Dados de entrada inválidos', 400, error.errors);
      }
      
      throw new AppError('Erro ao atualizar pessoa', 500);
    }
  },

  // DELETE - Deletar pessoa (soft delete)
  async deletePessoa(req: Request, res: Response) {
    try {
      const pessoaAtualizada = await Pessoa.findByIdAndUpdate(
        req.params.id,
        { ativo: false },
        { new: true }
      );

      if (!pessoaAtualizada) {
        throw new AppError('Pessoa não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Pessoa desativada com sucesso',
        data: pessoaAtualizada,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao desativar pessoa', 500);
    }
  }
};