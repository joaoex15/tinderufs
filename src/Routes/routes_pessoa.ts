import express from "express";
import { creatPessoa } from "../services/Pessoas/CreatPessoa";
import { GetPessoaById } from "../services/Pessoas/GetPessoaById";
import { GetPessoas } from "../services/Pessoas/GetPessoas";
import { EditP_pessoa } from "../services/Pessoas/PatchPessoa";

export const routerPeople = express.Router();

// Rota POST /cadastro



routerPeople.post("/",creatPessoa)
routerPeople.get("/",GetPessoas)
routerPeople.get("/:id",GetPessoaById)
routerPeople.patch("/:id",EditP_pessoa)



