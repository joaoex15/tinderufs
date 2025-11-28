import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },

  senha: { 
    type: String,
    required: true
  }

}, { 
  timestamps: true // cria createdAt e updatedAt automaticamente
});

export default mongoose.model('Usuario', UsuarioSchema);