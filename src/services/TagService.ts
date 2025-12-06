// src/services/TagService.ts
import Tag, { ITag } from '../models/schemas/Tag';
import { Types } from 'mongoose';
import { ITagEstatisticas } from '../models/interfaces/ITag';

// Interface para criação de tag (sem métodos do Mongoose)
interface ITagCriacao {
  nome: string;
  descricao: string;
  categoria: string;
  ativa?: boolean;
  popularidade?: number;
}

// Interface para atualização de tag
interface ITagAtualizacao {
  descricao?: string;
  categoria?: string;
  ativa?: boolean;
  popularidade?: number;
}

export class TagService {
  // CREATE
  async criarTag(dados: ITagCriacao): Promise<ITag> {
    try {
      const tag = new Tag({
        nome: dados.nome.toLowerCase(),
        descricao: dados.descricao,
        categoria: dados.categoria || 'outro',
        ativa: dados.ativa ?? true,
        popularidade: dados.popularidade ?? 0
      });
      return await tag.save();
    } catch (error: any) {
      throw new Error(`Erro ao criar tag: ${error.message}`);
    }
  }

  // CREATE - Múltiplas tags
  async criarTags(tags: ITagCriacao[]): Promise<ITag[]> {
    try {
      // Preparar tags para inserção
      const tagsParaInserir = tags.map(tag => ({
        nome: tag.nome.toLowerCase(),
        descricao: tag.descricao,
        categoria: tag.categoria || 'outro',
        ativa: tag.ativa ?? true,
        popularidade: tag.popularidade ?? 0
      }));
      
      return await Tag.insertMany(tagsParaInserir);
    } catch (error: any) {
      throw new Error(`Erro ao criar múltiplas tags: ${error.message}`);
    }
  }

  // READ - Todas tags
  async listarTags(
    filtros: any = {},
    pagina: number = 1,
    limite: number = 50
  ): Promise<{ tags: ITag[]; total: number; paginas: number }> {
    try {
      const query = Tag.find(filtros);
      
      const total = await Tag.countDocuments(filtros);
      const tags = await query
        .skip((pagina - 1) * limite)
        .limit(limite)
        .sort({ popularidade: -1, nome: 1 })
        .exec();

      return {
        tags,
        total,
        paginas: Math.ceil(total / limite)
      };
    } catch (error: any) {
      throw new Error(`Erro ao listar tags: ${error.message}`);
    }
  }

  // READ - Por ID
  async buscarTagPorId(id: string): Promise<ITag | null> {
    try {
      return await Tag.findById(id).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar tag: ${error.message}`);
    }
  }

  // READ - Por nome
  async buscarTagPorNome(nome: string): Promise<ITag | null> {
    try {
      return await Tag.findOne({ nome: nome.toLowerCase() }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar tag por nome: ${error.message}`);
    }
  }

  // READ - Por categoria
  async buscarTagsPorCategoria(categoria: string): Promise<ITag[]> {
    try {
      return await Tag.find({ 
        categoria,
        ativa: true 
      })
      .sort({ popularidade: -1, nome: 1 })
      .exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar tags por categoria: ${error.message}`);
    }
  }

  // READ - Tags populares
  async buscarTagsPopulares(limite: number = 10): Promise<ITag[]> {
    try {
      return await Tag.find({ ativa: true })
        .sort({ popularidade: -1 })
        .limit(limite)
        .exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar tags populares: ${error.message}`);
    }
  }

  // READ - Estatísticas de tags
  async buscarEstatisticasTags(): Promise<ITagEstatisticas[]> {
    try {
      const tags = await Tag.find({ ativa: true }).exec();
      
      // Esta é uma implementação básica - você precisará ajustar para buscar
      // o total_usuarios real do seu banco de dados
      return tags.map(tag => ({
        ...tag.toObject(),
        total_usuarios: 0 // Implementar contagem real
      }));
    } catch (error: any) {
      throw new Error(`Erro ao buscar estatísticas de tags: ${error.message}`);
    }
  }

  // UPDATE
  async atualizarTag(
    id: string, 
    dados: ITagAtualizacao
  ): Promise<ITag | null> {
    try {
      return await Tag.findByIdAndUpdate(
        id,
        { $set: dados },
        { new: true, runValidators: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao atualizar tag: ${error.message}`);
    }
  }

  // UPDATE - Incrementar popularidade
  async incrementarPopularidade(id: string, incremento: number = 1): Promise<ITag | null> {
    try {
      return await Tag.findByIdAndUpdate(
        id,
        { $inc: { popularidade: incremento } },
        { new: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao incrementar popularidade: ${error.message}`);
    }
  }

  // UPDATE - Ativar/Desativar tag
  async toggleAtivaTag(id: string, ativa: boolean): Promise<ITag | null> {
    try {
      return await Tag.findByIdAndUpdate(
        id,
        { $set: { ativa } },
        { new: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao alterar status da tag: ${error.message}`);
    }
  }

  // UPDATE - Atualizar nome da tag (com validação especial)
  async atualizarNomeTag(id: string, novoNome: string): Promise<ITag | null> {
    try {
      // Verificar se já existe tag com o novo nome
      const tagExistente = await Tag.findOne({ 
        nome: novoNome.toLowerCase(),
        _id: { $ne: new Types.ObjectId(id) }
      });

      if (tagExistente) {
        throw new Error(`Já existe uma tag com o nome "${novoNome}"`);
      }

      return await Tag.findByIdAndUpdate(
        id,
        { $set: { nome: novoNome.toLowerCase() } },
        { new: true, runValidators: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao atualizar nome da tag: ${error.message}`);
    }
  }

  // DELETE
  async excluirTag(id: string): Promise<ITag | null> {
    try {
      return await Tag.findByIdAndDelete(id).exec();
    } catch (error: any) {
      throw new Error(`Erro ao excluir tag: ${error.message}`);
    }
  }

  // Buscar ou criar tag
  async buscarOuCriarTag(
    nome: string, 
    dadosAdicionais: ITagAtualizacao = {}
  ): Promise<ITag> {
    try {
      let tag = await this.buscarTagPorNome(nome);
      
      if (!tag) {
        tag = await this.criarTag({
          nome,
          descricao: dadosAdicionais.descricao || `Tag ${nome}`,
          categoria: dadosAdicionais.categoria || 'outro',
          ativa: dadosAdicionais.ativa,
          popularidade: dadosAdicionais.popularidade
        });
      }
      
      return tag;
    } catch (error: any) {
      throw new Error(`Erro ao buscar ou criar tag: ${error.message}`);
    }
  }

  // Verificar se tag existe
  async tagExiste(id: string): Promise<boolean> {
    try {
      const count = await Tag.countDocuments({ _id: id, ativa: true }).exec();
      return count > 0;
    } catch (error: any) {
      throw new Error(`Erro ao verificar existência da tag: ${error.message}`);
    }
  }

  // Buscar tags por IDs
  async buscarTagsPorIds(ids: string[]): Promise<ITag[]> {
    try {
      const objectIds = ids.map(id => new Types.ObjectId(id));
      return await Tag.find({ 
        _id: { $in: objectIds },
        ativa: true 
      }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar tags por IDs: ${error.message}`);
    }
  }

  // Buscar tags por nomes
  async buscarTagsPorNomes(nomes: string[]): Promise<ITag[]> {
    try {
      const nomesLowerCase = nomes.map(nome => nome.toLowerCase());
      return await Tag.find({ 
        nome: { $in: nomesLowerCase },
        ativa: true 
      }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar tags por nomes: ${error.message}`);
    }
  }

  // Buscar tags sugeridas (baseadas em popularidade e categoria)
  async buscarTagsSugeridas(
    categoria?: string, 
    limite: number = 10
  ): Promise<ITag[]> {
    try {
      const filtro: any = { ativa: true };
      
      if (categoria) {
        filtro.categoria = categoria;
      }

      return await Tag.find(filtro)
        .sort({ popularidade: -1 })
        .limit(limite)
        .exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar tags sugeridas: ${error.message}`);
    }
  }

  // Buscar tags com filtro de busca por nome
  async buscarTagsPorTermo(termo: string, limite: number = 20): Promise<ITag[]> {
    try {
      return await Tag.find({
        nome: { $regex: termo.toLowerCase(), $options: 'i' },
        ativa: true
      })
      .sort({ popularidade: -1 })
      .limit(limite)
      .exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar tags por termo: ${error.message}`);
    }
  }

  // Incrementar popularidade de múltiplas tags
  async incrementarPopularidadeMultiplas(ids: string[], incremento: number = 1): Promise<void> {
    try {
      await Tag.updateMany(
        { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
        { $inc: { popularidade: incremento } }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao incrementar popularidade de múltiplas tags: ${error.message}`);
    }
  }

  // Verificar se todas as tags existem
  async todasTagsExistem(ids: string[]): Promise<boolean> {
    try {
      const objectIds = ids.map(id => new Types.ObjectId(id));
      const count = await Tag.countDocuments({ 
        _id: { $in: objectIds },
        ativa: true 
      }).exec();
      
      return count === ids.length;
    } catch (error: any) {
      throw new Error(`Erro ao verificar existência das tags: ${error.message}`);
    }
  }

  // Listar todas as categorias disponíveis
  async listarCategorias(): Promise<string[]> {
    try {
      const categorias = await Tag.distinct('categoria').exec();
      return categorias.filter(Boolean) as string[];
    } catch (error: any) {
      throw new Error(`Erro ao listar categorias: ${error.message}`);
    }
  }

  // Buscar tags com paginação e ordenação personalizada
  async buscarTagsComFiltros(
    filtros: {
      categoria?: string;
      ativa?: boolean;
      termo?: string;
    },
    ordenacao: {
      campo: 'nome' | 'popularidade' | 'createdAt' | 'updatedAt';
      direcao: 'asc' | 'desc';
    } = { campo: 'popularidade', direcao: 'desc' },
    pagina: number = 1,
    limite: number = 20
  ): Promise<{ tags: ITag[]; total: number; paginas: number }> {
    try {
      const queryFiltros: any = {};
      
      if (filtros.categoria) {
        queryFiltros.categoria = filtros.categoria;
      }
      
      if (filtros.ativa !== undefined) {
        queryFiltros.ativa = filtros.ativa;
      }
      
      if (filtros.termo) {
        queryFiltros.nome = { $regex: filtros.termo.toLowerCase(), $options: 'i' };
      }

      const query = Tag.find(queryFiltros);
      const total = await Tag.countDocuments(queryFiltros);
      
      const tags = await query
        .sort({ [ordenacao.campo]: ordenacao.direcao === 'asc' ? 1 : -1 })
        .skip((pagina - 1) * limite)
        .limit(limite)
        .exec();

      return {
        tags,
        total,
        paginas: Math.ceil(total / limite)
      };
    } catch (error: any) {
      throw new Error(`Erro ao buscar tags com filtros: ${error.message}`);
    }
  }

  // Verificar se tag está sendo usada por alguma pessoa
  async tagEstaSendoUsada(tagId: string): Promise<boolean> {
    try {
      // Esta consulta depende do seu modelo de Pessoa
      // Você precisará importar e usar o modelo Pessoa aqui
      // Exemplo:
      // const Pessoa = require('../models/schemas/Pessoa');
      // const count = await Pessoa.countDocuments({ 'tags.tag_id': tagId }).exec();
      // return count > 0;
      
      return false; // Implementar conforme sua estrutura
    } catch (error: any) {
      throw new Error(`Erro ao verificar uso da tag: ${error.message}`);
    }
  }
}

export default new TagService();