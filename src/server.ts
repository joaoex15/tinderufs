import express from "express";
import { router } from "./routes";
const app =express()
const port= process.env.PORT
app.use(express.json())
app.use('/users',router)
app.listen(port,()=>console.log("Iniciado"))