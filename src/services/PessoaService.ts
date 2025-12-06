// src/services/PessoaService.ts
import Pessoa, { IPessoa } from '../models/schemas/Pessoa';
import { Types } from 'mongoose';
import { IPerfilCompleto } from '../models/consultas/IPerfilCompleto';

export class PessoaService {
  // CREATE
  async criarPessoa(dados: Partial<IPessoa>): Promise<IPessoa> {
    try {
      const pessoa = new Pessoa(dados);
      return await pessoa.save();
    } catch (error: any) {
      throw new Error(`Erro ao criar pessoa: ${error.message}`);
    }
  }

  // READ - Todos
  async listarPessoas(
    filtros: any = {},
    pagina: number = 1,
    limite: number = 20
  ): Promise<{ pessoas: IPessoa[]; total: number; paginas: number }> {
    try {
      const query = Pessoa.find(filtros);
      
      const total = await Pessoa.countDocuments(filtros);
      const pessoas = await query
        .skip((pagina - 1) * limite)
        .limit(limite)
        .sort({ createdAt: -1 })
        .exec();

      return {
        pessoas,
        total,
        paginas: Math.ceil(total / limite)
      };
    } catch (error: any) {
      throw new Error(`Erro ao listar pessoas: ${error.message}`);
    }
  }

  // READ - Por ID
  async buscarPessoaPorId(id: string): Promise<IPessoa | null> {
    try {
      return await Pessoa.findById(id).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar pessoa: ${error.message}`);
    }
  }

  // READ - Por Email
  async buscarPessoaPorEmail(email: string): Promise<IPessoa | null> {
    try {
      return await Pessoa.findOne({ email: email.toLowerCase() }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar pessoa por email: ${error.message}`);
    }
  }

  // READ - Por Usuário ID
  async buscarPessoaPorUsuarioId(usuarioId: string): Promise<IPessoa | null> {
    try {
      return await Pessoa.findOne({ usuario_id: new Types.ObjectId(usuarioId) }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar pessoa por usuário: ${error.message}`);
    }
  }

  // READ - Perfil Completo
  async buscarPerfilCompleto(pessoaId: string): Promise<IPerfilCompleto | null> {
    try {
      // Esta é uma implementação básica - você precisará ajustar conforme sua estrutura real
      const pessoa = await Pessoa.findById(pessoaId).exec();
      
      if (!pessoa) return null;

      // Aqui você implementaria as queries agregadas para buscar imagens, tags detalhadas, etc.
      // Por enquanto, retornamos apenas os dados da pessoa
      const perfilCompleto: IPerfilCompleto = {
        ...pessoa.toObject(),
        imagens: [],
        tags_detalhadas: [],
        total_matches: 0,
        matches_ativos: 0,
        percentual_match: 0
      };

      return perfilCompleto;
    } catch (error: any) {
      throw new Error(`Erro ao buscar perfil completo: ${error.message}`);
    }
  }

  // UPDATE
  async atualizarPessoa(id: string, dados: Partial<IPessoa>): Promise<IPessoa | null> {
    try {
      return await Pessoa.findByIdAndUpdate(
        id,
        { $set: dados },
        { new: true, runValidators: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao atualizar pessoa: ${error.message}`);
    }
  }

  // UPDATE - Tags
  async atualizarTagsPessoa(id: string, tags: Array<{ tag_id?: Types.ObjectId; nome: string }>): Promise<IPessoa | null> {
    try {
      return await Pessoa.findByIdAndUpdate(
        id,
        { $set: { tags } },
        { new: true, runValidators: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao atualizar tags: ${error.message}`);
    }
  }

  // DELETE (Soft Delete - desativar)
  async desativarPessoa(id: string): Promise<IPessoa | null> {
    try {
      return await Pessoa.findByIdAndUpdate(
        id,
        { $set: { ativo: false } },
        { new: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao desativar pessoa: ${error.message}`);
    }
  }

  // DELETE (Hard Delete)
  async excluirPessoa(id: string): Promise<IPessoa | null> {
    try {
      return await Pessoa.findByIdAndDelete(id).exec();
    } catch (error: any) {
      throw new Error(`Erro ao excluir pessoa: ${error.message}`);
    }
  }

  // Buscar pessoas por tags
  async buscarPorTags(tags: string[]): Promise<IPessoa[]> {
    try {
      return await Pessoa.find({
        'tags.nome': { $in: tags },
        ativo: true
      }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar pessoas por tags: ${error.message}`);
    }
  }

  // Verificar se pessoa existe
  async pessoaExiste(id: string): Promise<boolean> {
    try {
      const count = await Pessoa.countDocuments({ _id: id, ativo: true }).exec();
      return count > 0;
    } catch (error: any) {
      throw new Error(`Erro ao verificar existência da pessoa: ${error.message}`);
    }
  }
}

export default new PessoaService();