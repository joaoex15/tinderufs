import { Types } from "mongoose";

export interface ITag {
  _id: Types.ObjectId;
  nome: string;
  descricao: string;
  categoria: string;
  ativa: boolean;
  popularidade: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITagEstatisticas extends ITag {
  total_usuarios: number;
}