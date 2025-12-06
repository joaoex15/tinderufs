// src/services/ImagemService.ts
import Imagem, { IImagem } from '../models/schemas/Imagem';
import { Types } from 'mongoose';

export class ImagemService {
  // CREATE
  async criarImagem(dados: Omit<IImagem, '_id' | 'createdAt'>): Promise<IImagem> {
    try {
      const imagem = new Imagem(dados);
      return await imagem.save();
    } catch (error: any) {
      throw new Error(`Erro ao criar imagem: ${error.message}`);
    }
  }

  // CREATE - Múltiplas imagens
  async criarImagens(imagens: Array<Omit<IImagem, '_id' | 'createdAt'>>): Promise<IImagem[]> {
    try {
      // Garantir que todos os campos obrigatórios estão presentes
      const imagensCompletas = imagens.map(imagem => ({
        ...imagem,
        pessoa_id: imagem.pessoa_id,
        caminho_arquivo: imagem.caminho_arquivo,
        ordem: imagem.ordem ?? 0,
        principal: imagem.principal ?? false,
        aprovada: imagem.aprovada ?? true
      }));
      
      return await Imagem.insertMany(imagensCompletas);
    } catch (error: any) {
      throw new Error(`Erro ao criar múltiplas imagens: ${error.message}`);
    }
  }

  // READ - Todas imagens de uma pessoa
  async listarImagensPorPessoa(
    pessoaId: string,
    apenasAprovadas: boolean = true
  ): Promise<IImagem[]> {
    try {
      const filtro: any = { pessoa_id: new Types.ObjectId(pessoaId) };
      
      if (apenasAprovadas) {
        filtro.aprovada = true;
      }

      return await Imagem.find(filtro)
        .sort({ ordem: 1, createdAt: 1 })
        .exec();
    } catch (error: any) {
      throw new Error(`Erro ao listar imagens: ${error.message}`);
    }
  }

  // READ - Imagem por ID
  async buscarImagemPorId(id: string): Promise<IImagem | null> {
    try {
      return await Imagem.findById(id).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar imagem: ${error.message}`);
    }
  }

  // READ - Imagem principal de uma pessoa
  async buscarImagemPrincipal(pessoaId: string): Promise<IImagem | null> {
    try {
      return await Imagem.findOne({
        pessoa_id: new Types.ObjectId(pessoaId),
        principal: true,
        aprovada: true
      }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar imagem principal: ${error.message}`);
    }
  }

  // UPDATE
  async atualizarImagem(
    id: string, 
    dados: Partial<Omit<IImagem, '_id' | 'pessoa_id' | 'createdAt'>>
  ): Promise<IImagem | null> {
    try {
      return await Imagem.findByIdAndUpdate(
        id,
        { $set: dados },
        { new: true, runValidators: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao atualizar imagem: ${error.message}`);
    }
  }

  // UPDATE - Ordenar imagens
  async reordenarImagens(pessoaId: string, novasOrdens: Array<{ id: string; ordem: number }>): Promise<void> {
    try {
      const bulkOps = novasOrdens.map(({ id, ordem }) => ({
        updateOne: {
          filter: { 
            _id: new Types.ObjectId(id),
            pessoa_id: new Types.ObjectId(pessoaId)
          },
          update: { $set: { ordem } }
        }
      }));

      await Imagem.bulkWrite(bulkOps);
    } catch (error: any) {
      throw new Error(`Erro ao reordenar imagens: ${error.message}`);
    }
  }

  // UPDATE - Definir imagem como principal
  async definirComoPrincipal(imagemId: string): Promise<IImagem | null> {
    try {
      const imagem = await Imagem.findById(imagemId);
      if (!imagem) return null;

      // O middleware do schema cuidará de remover a principal anterior
      imagem.principal = true;
      return await imagem.save();
    } catch (error: any) {
      throw new Error(`Erro ao definir imagem como principal: ${error.message}`);
    }
  }

  // UPDATE - Aprovar/Rejeitar imagem
  async moderarImagem(
    id: string, 
    aprovada: boolean, 
    motivoRejeicao?: string
  ): Promise<IImagem | null> {
    try {
      const update: any = { aprovada };
      
      if (!aprovada && motivoRejeicao) {
        update.motivo_rejeicao = motivoRejeicao;
      } else if (aprovada) {
        update.motivo_rejeicao = undefined;
      }

      return await Imagem.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao moderar imagem: ${error.message}`);
    }
  }

  // DELETE
  async excluirImagem(id: string): Promise<IImagem | null> {
    try {
      return await Imagem.findByIdAndDelete(id).exec();
    } catch (error: any) {
      throw new Error(`Erro ao excluir imagem: ${error.message}`);
    }
  }

  // DELETE - Todas imagens de uma pessoa
  async excluirImagensPorPessoa(pessoaId: string): Promise<{ deletedCount: number }> {
    try {
      const result = await Imagem.deleteMany({ 
        pessoa_id: new Types.ObjectId(pessoaId) 
      }).exec();
      
      return { deletedCount: result.deletedCount || 0 };
    } catch (error: any) {
      throw new Error(`Erro ao excluir imagens da pessoa: ${error.message}`);
    }
  }

  // Verificar quantidade de imagens
  async contarImagensPorPessoa(pessoaId: string): Promise<number> {
    try {
      return await Imagem.countDocuments({ 
        pessoa_id: new Types.ObjectId(pessoaId) 
      }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao contar imagens: ${error.message}`);
    }
  }

  // Verificar se pessoa tem imagem principal
  async temImagemPrincipal(pessoaId: string): Promise<boolean> {
    try {
      const count = await Imagem.countDocuments({
        pessoa_id: new Types.ObjectId(pessoaId),
        principal: true,
        aprovada: true
      }).exec();
      
      return count > 0;
    } catch (error: any) {
      throw new Error(`Erro ao verificar imagem principal: ${error.message}`);
    }
  }

  // Buscar imagens aprovadas de uma pessoa (método auxiliar)
  async buscarImagensAprovadasPorPessoa(pessoaId: string): Promise<IImagem[]> {
    return this.listarImagensPorPessoa(pessoaId, true);
  }

  // Buscar todas imagens (incluindo não aprovadas) de uma pessoa
  async buscarTodasImagensPorPessoa(pessoaId: string): Promise<IImagem[]> {
    return this.listarImagensPorPessoa(pessoaId, false);
  }

  // Atualizar caminho do arquivo
  async atualizarCaminhoArquivo(id: string, caminhoArquivo: string): Promise<IImagem | null> {
    try {
      return await Imagem.findByIdAndUpdate(
        id,
        { $set: { caminho_arquivo: caminhoArquivo } },
        { new: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao atualizar caminho do arquivo: ${error.message}`);
    }
  }

  // Verificar se imagem existe e pertence à pessoa
  async imagemPertenceAPessoa(imagemId: string, pessoaId: string): Promise<boolean> {
    try {
      const count = await Imagem.countDocuments({
        _id: new Types.ObjectId(imagemId),
        pessoa_id: new Types.ObjectId(pessoaId)
      }).exec();
      
      return count > 0;
    } catch (error: any) {
      throw new Error(`Erro ao verificar propriedade da imagem: ${error.message}`);
    }
  }
}

export default new ImagemService();