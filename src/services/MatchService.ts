// src/services/MatchService.ts
import Match, { IMatch } from '../models/schemas/Match';
import { Types } from 'mongoose';
import { IMatchCompleto } from '../models/consultas/IMatchCompleto';

export class MatchService {
  // CREATE - Dar like
  async darLike(pessoaId: string, outraPessoaId: string): Promise<IMatch | null> {
    try {
      // Verificar se já existe match
      const matchExistente = await Match.findOne({
        $or: [
          { pessoa_1_id: pessoaId, pessoa_2_id: outraPessoaId },
          { pessoa_1_id: outraPessoaId, pessoa_2_id: pessoaId }
        ]
      }).exec();

      if (matchExistente) {
        // Se já existe, atualizar o like
        const isPessoa1 = matchExistente.pessoa_1_id.toString() === pessoaId;
        
        if (isPessoa1) {
          if (!matchExistente.match_pessoa_1) {
            matchExistente.match_pessoa_1 = true;
            return await matchExistente.save();
          }
        } else {
          if (!matchExistente.match_pessoa_2) {
            matchExistente.match_pessoa_2 = true;
            return await matchExistente.save();
          }
        }
        
        return matchExistente; // Já deu like anteriormente
      } else {
        // Criar novo match
        const novoMatch = new Match({
          pessoa_1_id: new Types.ObjectId(pessoaId),
          pessoa_2_id: new Types.ObjectId(outraPessoaId),
          match_pessoa_1: true,
          match_pessoa_2: false
        });
        
        return await novoMatch.save();
      }
    } catch (error: any) {
      throw new Error(`Erro ao dar like: ${error.message}`);
    }
  }

  // CREATE - Remover like
  async removerLike(pessoaId: string, outraPessoaId: string): Promise<IMatch | null> {
    try {
      const match = await Match.findOne({
        $or: [
          { pessoa_1_id: pessoaId, pessoa_2_id: outraPessoaId },
          { pessoa_1_id: outraPessoaId, pessoa_2_id: pessoaId }
        ]
      }).exec();

      if (!match) return null;

      const isPessoa1 = match.pessoa_1_id.toString() === pessoaId;
      
      if (isPessoa1) {
        match.match_pessoa_1 = false;
      } else {
        match.match_pessoa_2 = false;
      }

      return await match.save();
    } catch (error: any) {
      throw new Error(`Erro ao remover like: ${error.message}`);
    }
  }

  // READ - Listar matches de uma pessoa
  async listarMatches(
    pessoaId: string,
    apenasCompletos: boolean = true,
    pagina: number = 1,
    limite: number = 20
  ): Promise<{ matches: IMatch[]; total: number; paginas: number }> {
    try {
      const filtro: any = {
        $or: [
          { pessoa_1_id: new Types.ObjectId(pessoaId) },
          { pessoa_2_id: new Types.ObjectId(pessoaId) }
        ]
      };

      if (apenasCompletos) {
        filtro.match_completo = true;
      }

      const query = Match.find(filtro);
      
      const total = await Match.countDocuments(filtro);
      const matches = await query
        .skip((pagina - 1) * limite)
        .limit(limite)
        .sort({ data_match: -1, createdAt: -1 })
        .exec();

      return {
        matches,
        total,
        paginas: Math.ceil(total / limite)
      };
    } catch (error: any) {
      throw new Error(`Erro ao listar matches: ${error.message}`);
    }
  }

  // READ - Buscar match específico
  async buscarMatch(pessoaId1: string, pessoaId2: string): Promise<IMatch | null> {
    try {
      return await Match.findOne({
        $or: [
          { pessoa_1_id: pessoaId1, pessoa_2_id: pessoaId2 },
          { pessoa_1_id: pessoaId2, pessoa_2_id: pessoaId1 }
        ]
      }).exec();
    } catch (error: any) {
      throw new Error(`Erro ao buscar match: ${error.message}`);
    }
  }

  // READ - Matches completos (com detalhes)
  async buscarMatchesCompletos(
    pessoaId: string
  ): Promise<IMatchCompleto[]> {
    try {
      // Esta é uma implementação básica - você precisará ajustar
      const matches = await this.listarMatches(pessoaId, true, 1, 100);
      
      // Aqui você implementaria a lógica para buscar dados detalhados
      // da outra pessoa, imagens, tags comuns, etc.
      
      return matches.matches.map(match => ({
        match: match.toObject(),
        outra_pessoa: {
          _id: new Types.ObjectId(),
          nome: '',
          curso: null,
          data_nasc: new Date(),
          periodo: null,
          email: '',
          genero: 'outro',
          sexualidade: 'outro',
          descricao: '',
          tags: []
        },
        imagens_outra_pessoa: [],
        tags_comuns: [],
        percentual_compatibilidade: 0
      }));
    } catch (error: any) {
      throw new Error(`Erro ao buscar matches completos: ${error.message}`);
    }
  }

  // READ - Likes recebidos (unidirecionais)
  async listarLikesRecebidos(pessoaId: string): Promise<IMatch[]> {
    try {
      return await Match.find({
        $or: [
          { 
            pessoa_1_id: new Types.ObjectId(pessoaId),
            match_pessoa_2: true,
            match_pessoa_1: false 
          },
          { 
            pessoa_2_id: new Types.ObjectId(pessoaId),
            match_pessoa_1: true,
            match_pessoa_2: false 
          }
        ],
        match_completo: false
      })
      .sort({ createdAt: -1 })
      .exec();
    } catch (error: any) {
      throw new Error(`Erro ao listar likes recebidos: ${error.message}`);
    }
  }

  // READ - Likes dados (unidirecionais)
  async listarLikesDados(pessoaId: string): Promise<IMatch[]> {
    try {
      return await Match.find({
        $or: [
          { 
            pessoa_1_id: new Types.ObjectId(pessoaId),
            match_pessoa_1: true,
            match_pessoa_2: false 
          },
          { 
            pessoa_2_id: new Types.ObjectId(pessoaId),
            match_pessoa_2: true,
            match_pessoa_1: false 
          }
        ],
        match_completo: false
      })
      .sort({ createdAt: -1 })
      .exec();
    } catch (error: any) {
      throw new Error(`Erro ao listar likes dados: ${error.message}`);
    }
  }

  // UPDATE - Atualizar match
  async atualizarMatch(id: string, dados: Partial<IMatch>): Promise<IMatch | null> {
    try {
      return await Match.findByIdAndUpdate(
        id,
        { $set: dados },
        { new: true, runValidators: true }
      ).exec();
    } catch (error: any) {
      throw new Error(`Erro ao atualizar match: ${error.message}`);
    }
  }

  // DELETE - Excluir match
  async excluirMatch(id: string): Promise<IMatch | null> {
    try {
      return await Match.findByIdAndDelete(id).exec();
    } catch (error: any) {
      throw new Error(`Erro ao excluir match: ${error.message}`);
    }
  }

  // Verificar se é match completo
  async verificarMatchCompleto(pessoaId1: string, pessoaId2: string): Promise<boolean> {
    try {
      const match = await this.buscarMatch(pessoaId1, pessoaId2);
      return match?.match_completo || false;
    } catch (error: any) {
      throw new Error(`Erro ao verificar match completo: ${error.message}`);
    }
  }

  // Contar total de matches
  async contarMatches(pessoaId: string): Promise<{
    total: number;
    completos: number;
    likes_dados: number;
    likes_recebidos: number;
  }> {
    try {
      const [total, completos, likes_dados, likes_recebidos] = await Promise.all([
        Match.countDocuments({
          $or: [
            { pessoa_1_id: new Types.ObjectId(pessoaId) },
            { pessoa_2_id: new Types.ObjectId(pessoaId) }
          ]
        }),
        Match.countDocuments({
          $or: [
            { pessoa_1_id: new Types.ObjectId(pessoaId) },
            { pessoa_2_id: new Types.ObjectId(pessoaId) }
          ],
          match_completo: true
        }),
        this.listarLikesDados(pessoaId).then(matches => matches.length),
        this.listarLikesRecebidos(pessoaId).then(matches => matches.length)
      ]);

      return {
        total,
        completos,
        likes_dados,
        likes_recebidos
      };
    } catch (error: any) {
      throw new Error(`Erro ao contar matches: ${error.message}`);
    }
  }
}

export default new MatchService();