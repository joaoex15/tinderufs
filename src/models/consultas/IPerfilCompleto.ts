import { Document, Types } from "mongoose";

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
  createdAt: Date;
  updatedAt: Date;
  
  // Dados agregados
  imagens_principais: Array<{
    _id: Types.ObjectId;
    pessoa_id: Types.ObjectId;
    caminho_arquivo: string;
    createdAt: Date;
  }>;
  
  tags_principais: Array<{
    _id: Types.ObjectId;
    nome: string;
  }>;
  
  total_matches: number;
}