// models/interfaces/IUsuario.ts (nova)
import { Types } from "mongoose";

export interface IUsuario {
  _id: Types.ObjectId;
  nome: string;
  email: string;
  pessoa_id: Types.ObjectId;
  verificado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUsuarioComSenha extends IUsuario {
  senha: string;
}

export interface IUsuarioLogin {
  email: string;
  senha: string;
}

export interface IUsuarioRegistro {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}