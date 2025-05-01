import express from "express";
import { CreatPessoaTag } from "../services/Pessoa_tags/CreatPessoa_tags";
import { DeletePessoatag } from "../services/Pessoa_tags/DeletePessoaTag";
import { EditP_pessoaTags } from "../services/Pessoa_tags/EditP_pessoatags";
import { Get_PessoaTags } from "../services/Pessoa_tags/GetPessoa_tags";
import { GetPessoaTagsById } from "../services/Pessoa_tags/GetPessoatagsById";
;

export const routerPessoaTag = express.Router();

// Rota POST /cadastro



routerPessoaTag.post("/",CreatPessoaTag)
routerPessoaTag.get("/",Get_PessoaTags)
routerPessoaTag.get("/:id",GetPessoaTagsById)
routerPessoaTag.patch("/:id",EditP_pessoaTags)
routerPessoaTag.delete("/:id",DeletePessoatag)


