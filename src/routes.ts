import express from "express";
import { creatUser } from "./services/users/CreatUser.js";
import { Delete_User } from "./services/users/Delete_user.js";
import { EditF_user } from "./services/users/EditF_user.js";
import { Get_UserById } from "./services/users/Get_UserById.js";
import { Get_User } from "./services/users/Get_Users.js";
export const router = express.Router();

// Rota POST /cadastro
router.post("/", creatUser);
router.get("/", Get_User);
router.get("/:id",Get_UserById);
router.delete("/:id",Delete_User);
router.patch("/:id", EditF_user);






  