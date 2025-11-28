import { Request, Response } from 'express';
import Tag from "../models/schemas/Tags.js";
import { AppError } from "./middleware/errorHandler.js";

const isDuplicateError = (error: any): error is { code: number } => {
  return error.code === 11000;
};

export const tagsController = {
  async createTag(req: Request, res: Response) {
    try {
      const { nome } = req.body;

      if (!nome || typeof nome !== 'string') {
        throw new AppError('Nome da tag é obrigatório', 400);
      }

      const tagExistente = await Tag.findOne({ nome: nome.toLowerCase().trim() });
      if (tagExistente) {
        throw new AppError('Tag já existe', 409);
      }

      const novaTag = new Tag({ 
        nome: nome.toLowerCase().trim() 
      });
      await novaTag.save();

      res.status(201).json({
        success: true,
        message: 'Tag criada com sucesso',
        data: novaTag,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      
      if (isDuplicateError(error)) {
        throw new AppError('Já existe uma tag com este nome', 409);
      }
      
      throw new AppError('Erro ao criar tag', 500);
    }
  },

  async getTags(req: Request, res: Response) {
    try {
      const tags = await Tag.find().sort({ nome: 1 });

      res.status(200).json({
        success: true,
        message: 'Tags recuperadas com sucesso',
        data: tags,
        count: tags.length,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      throw new AppError('Erro ao buscar tags', 500);
    }
  },

  async getTagById(req: Request, res: Response) {
    try {
      const tag = await Tag.findById(req.params.id);

      if (!tag) {
        throw new AppError('Tag não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Tag encontrada',
        data: tag,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao buscar tag', 500);
    }
  },

  async updateTag(req: Request, res: Response) {
    try {
      const { nome } = req.body;

      if (!nome || typeof nome !== 'string') {
        throw new AppError('Nome da tag é obrigatório', 400);
      }

      const tagAtualizada = await Tag.findByIdAndUpdate(
        req.params.id,
        { nome: nome.toLowerCase().trim() },
        { new: true, runValidators: true }
      );

      if (!tagAtualizada) {
        throw new AppError('Tag não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Tag atualizada com sucesso',
        data: tagAtualizada,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      
      if (isDuplicateError(error)) {
        throw new AppError('Já existe uma tag com este nome', 409);
      }
      
      throw new AppError('Erro ao atualizar tag', 500);
    }
  },

  async deleteTag(req: Request, res: Response) {
    try {
      const tagDeletada = await Tag.findByIdAndDelete(req.params.id);

      if (!tagDeletada) {
        throw new AppError('Tag não encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Tag deletada com sucesso',
        data: tagDeletada,
        timestamp: new Date()
      });
    } catch (error: unknown) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao deletar tag', 500);
    }
  }
};