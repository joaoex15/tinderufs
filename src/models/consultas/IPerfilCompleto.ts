// models/consultas/IPerfilCompleto.ts
import { Types } from "mongoose";

export interface IPerfilCompleto {
  // Dados da Pessoa
  _id: Types.ObjectId;
  nome: string;
  curso: string | null;
  data_nasc: Date;
  periodo: string | null;
  email: string;
  genero: "masculino" | "feminino" | "não-binário" | "outro";
  sexualidade: "hetero" | "gay" | "bi" | "pan" | "assexual" | "outro";
  descricao: string;
  ativo: boolean;
  instagram?: string;
  whatsapp?: string;
  telegram?: string;
  tags: Array<{ tag_id?: Types.ObjectId; nome: string }>;
  usuario_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Dados agregados
  imagens: Array<{
    _id: Types.ObjectId;
    pessoa_id: Types.ObjectId;
    caminho_arquivo: string;
    ordem: number;
    principal: boolean;
    aprovada: boolean;
    createdAt: Date;
  }>;
  
  tags_detalhadas: Array<{
    _id: Types.ObjectId;
    nome: string;
    descricao: string;
    categoria: string;
  }>;
  
  total_matches: number;
  matches_ativos: number;
  percentual_match: number; // Compatibilidade baseada em tags
}