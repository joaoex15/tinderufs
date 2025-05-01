import express from "express";
import { routerPeople } from "./Routes/routes_pessoa";
import { routerTag } from "./Routes/routes_tag";
import { routerUser } from "./Routes/routes_user";

const app =express()
const port= process.env.PORT
app.use(express.json())
app.use('/users',routerUser)
app.use('/peoples',routerPeople)
app.use('/tags',routerTag)

app.listen(port,()=>console.log("Iniciado"))