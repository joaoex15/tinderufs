// models/consultas/IMatchCompleto.ts
import { Types } from "mongoose";

export interface IMatchCompleto {
  match: {
    _id: Types.ObjectId;
    pessoa_1_id: Types.ObjectId;
    pessoa_2_id: Types.ObjectId;
    match_pessoa_1: boolean;
    match_pessoa_2: boolean;
    match_completo: boolean;
    data_match: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  
  outra_pessoa: {
    _id: Types.ObjectId;
    nome: string;
    curso: string | null;
    data_nasc: Date;
    periodo: string | null;
    email: string;
    genero: "masculino" | "feminino" | "não-binário" | "outro";
    sexualidade: "hetero" | "gay" | "bi" | "pan" | "assexual" | "outro";
    descricao: string;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    tags: Array<{ tag_id?: Types.ObjectId; nome: string }>;
  };
  
  imagens_outra_pessoa: Array<{
    _id: Types.ObjectId;
    caminho_arquivo: string;
    ordem: number;
    principal: boolean;
  }>;
  
  tags_comuns: Array<{
    _id: Types.ObjectId;
    nome: string;
    categoria: string;
  }>;
  
  percentual_compatibilidade: number;
}