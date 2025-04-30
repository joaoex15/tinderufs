import express from "express";
import { routerPeople } from "./Routes/routes.pessoa";
import { routerUser } from "./Routes/routes_user";

const app =express()
const port= process.env.PORT
app.use(express.json())
app.use('/users',routerUser)
app.use('/peoples',routerPeople)
app.listen(port,()=>console.log("Iniciado"))