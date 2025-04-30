import express from "express";
import { creatPessoa } from "../services/Pessoas/CreatPessoa.js";
import { creatUser } from "../services/users/CreatUser.js";
import { Delete_User } from "../services/users/Delete_user.js";
import { EditF_user } from "../services/users/EditF_user.js";
import { EditP_user } from "../services/users/EditP_user.js";
import { Get_UserById } from "../services/users/Get_UserById.js";
import { Get_User } from "../services/users/Get_Users.js";
export const routerUser = express.Router();

// Rota POST /cadastro
routerUser.post("/", creatUser);
routerUser.get("/", Get_User);
routerUser.get("/:id",Get_UserById);
routerUser.delete("/:id",Delete_User);
routerUser.patch("/:id", EditP_user);
routerUser.put("/:id", EditF_user);



routerUser.post("/pessoa",creatPessoa)





  