import express from "express";
import { CreatTag } from "../services/Tags_list/Creat_tag";
import { Get_TagById } from "../services/Tags_list/Get_TagById";
import { Get_Tags } from "../services/Tags_list/Get_tags";
import { EditP_Tag } from "../services/Tags_list/PatchTag";
;

export const routerTag = express.Router();

// Rota POST /cadastro



routerTag.post("/",CreatTag)
routerTag.get("/",Get_Tags)
routerTag.get("/:id",Get_TagById)
routerTag.patch("/:id",EditP_Tag)




