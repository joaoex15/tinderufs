import { Request, Response } from 'express';
import Imagem from "../models/schemas/Imagem.js";
import { AppError } from "./middleware/errorHandler.js";

// Helper para verificar se é erro de validação do Mongoose
const isValidationError = (error: any): error is { name: string; errors: any } => {
  return error.name === 'ValidationError';
};

export const imagemController = {
  // UPLOAD - Fazer upload de imagem
  async uploadImagem(req: Request, res: Response) {
    try {
      const { pessoa_id, caminho_arquivo } = req.body;

      // Validações obrigatórias
      if (!pessoa_id) {
        throw new AppError('pessoa_id é obrigatório', 400);
      }

      if (!caminho_arquivo) {
        throw new AppError('caminho_arquivo é obrigatório', 400);
      }

      // Verificar se a pessoa existe (opcional, mas recomendado)
      // Você pode adicionar uma verificação aqui se quiser

      const novaImagem = new Imagem({
        pessoa_id,
        caminho_arquivo
      });

      await novaImagem.save();

      res.status(201).json({
        success: true,
        message: 'Imagem enviada com sucesso',
        data: novaImagem,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      
      if (isValidationError(error)) {
        throw new AppError('Dados de entrada inválidos', 400, error.errors);
      }
      
      throw new AppError('Erro ao fazer upload da imagem', 500);
    }
  },

  // GET BY PESSOA - Buscar imagens por pessoa
  async getImagensByPessoa(req: Request, res: Response) {
    try {
      const { pessoaId } = req.params;

      if (!pessoaId) {
        throw new AppError('ID da pessoa é obrigatório', 400);
      }

      const imagens = await Imagem.find({ 
        pessoa_id: pessoaId 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: 'Imagens recuperadas com sucesso',
        data: imagens,
        count: imagens.length,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao buscar imagens', 500);
    }
  },

  // GET BY ID - Buscar imagem por ID
  async getImagemById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('ID da imagem é obrigatório', 400);
      }

      const imagem = await Imagem.findById(id);

      if (!imagem) {
        throw new AppError('Imagem não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Imagem encontrada',
        data: imagem,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao buscar imagem', 500);
    }
  },

  // GET ALL - Buscar todas imagens (com paginação opcional)
  async getAllImagens(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const imagens = await Imagem.find()
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip((pageNum - 1) * limitNum);

      const total = await Imagem.countDocuments();

      res.status(200).json({
        success: true,
        message: 'Imagens recuperadas com sucesso',
        data: imagens,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        timestamp: new Date()
      });
    } catch (error: unknown) {
      throw new AppError('Erro ao buscar imagens', 500);
    }
  },

  // UPDATE - Atualizar imagem (ex: marcar como principal)
  async updateImagem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!id) {
        throw new AppError('ID da imagem é obrigatório', 400);
      }

      // Campos que não podem ser atualizados
      const camposProtegidos = ['_id', 'pessoa_id', 'createdAt'];
      const camposInvalidos = camposProtegidos.filter(field => field in updates);
      
      if (camposInvalidos.length > 0) {
        throw new AppError(`Não é permitido alterar: ${camposInvalidos.join(', ')}`, 400);
      }

      const imagemAtualizada = await Imagem.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );

      if (!imagemAtualizada) {
        throw new AppError('Imagem não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Imagem atualizada com sucesso',
        data: imagemAtualizada,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      
      if (isValidationError(error)) {
        throw new AppError('Dados de entrada inválidos', 400, error.errors);
      }
      
      throw new AppError('Erro ao atualizar imagem', 500);
    }
  },

  // DELETE - Deletar imagem
  async deleteImagem(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('ID da imagem é obrigatório', 400);
      }

      const imagemDeletada = await Imagem.findByIdAndDelete(id);

      if (!imagemDeletada) {
        throw new AppError('Imagem não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Imagem deletada com sucesso',
        data: imagemDeletada,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao deletar imagem', 500);
    }
  },

  // DELETE ALL BY PESSOA - Deletar todas imagens de uma pessoa
  async deleteImagensByPessoa(req: Request, res: Response) {
    try {
      const { pessoaId } = req.params;

      if (!pessoaId) {
        throw new AppError('ID da pessoa é obrigatório', 400);
      }

      const resultado = await Imagem.deleteMany({ pessoa_id: pessoaId });

      res.status(200).json({
        success: true,
        message: 'Imagens deletadas com sucesso',
        data: {
          pessoa_id: pessoaId,
          imagensDeletadas: resultado.deletedCount
        },
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao deletar imagens', 500);
    }
  }
};