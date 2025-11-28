import { Types } from "mongoose";

export interface IMatchCompleto {
  match: {
    _id: Types.ObjectId;
    pessoa_1_id: Types.ObjectId;
    pessoa_2_id: Types.ObjectId;
    match: boolean;
    created_at: Date;
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
    tags: Array<{ tag_id?: Types.ObjectId; nome: string }>;
  };
  
  tags_comuns: Array<{
    _id: Types.ObjectId;
    nome: string;
  }>;
}