// models/schemas/Usuario.ts
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUsuario extends mongoose.Document {
  nome: string;
  email: string;
  senha: string;
  pessoa_id: mongoose.Types.ObjectId;
  verificado: boolean;
  createdAt: Date;
  updatedAt: Date;
  compararSenha(senha: string): Promise<boolean>;
}

const UsuarioSchema = new mongoose.Schema<IUsuario>({
  nome: { 
    type: String, 
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres']
  },
  email: { 
    type: String, 
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, informe um email válido']
  },
  senha: { 
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false // Não retorna em queries por padrão
  },
  pessoa_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: [true, 'ID da pessoa é obrigatório'],
    unique: true // Uma pessoa por usuário
  },
  verificado: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true
});

// Middleware para encriptar senha antes de salvar
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar senhas
UsuarioSchema.methods.compararSenha = async function(senha: string): Promise<boolean> {
  return await bcrypt.compare(senha, this.senha);
};

// Índices
UsuarioSchema.index({ email: 1 }, { unique: true });
UsuarioSchema.index({ pessoa_id: 1 }, { unique: true });
UsuarioSchema.index({ verificado: 1 });

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);