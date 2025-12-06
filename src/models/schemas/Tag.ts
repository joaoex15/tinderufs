// models/schemas/Tag.ts
import mongoose from "mongoose";

export interface ITag extends mongoose.Document {
  nome: string;
  descricao: string;
  categoria: string;
  ativa: boolean;
  popularidade: number;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new mongoose.Schema<ITag>({
  nome: { 
    type: String, 
    required: [true, 'Nome da tag é obrigatório'], 
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [2, 'Nome da tag deve ter pelo menos 2 caracteres'],
    maxlength: [30, 'Nome da tag não pode exceder 30 caracteres']
  },
  descricao: { 
    type: String, 
    required: [true, 'Descrição da tag é obrigatória'],
    trim: true,
    maxlength: [100, 'Descrição não pode exceder 100 caracteres']
  },
  categoria: {
    type: String,
    enum: {
      values: ['interesse', 'hobby', 'profissional', 'personalidade', 'outro'],
      message: 'Categoria inválida'
    },
    default: 'outro'
  },
  ativa: {
    type: Boolean,
    default: true
  },
  popularidade: {
    type: Number,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true 
});

// Índices
TagSchema.index({ nome: 1 }, { unique: true });
TagSchema.index({ categoria: 1 });
TagSchema.index({ ativa: 1 });
TagSchema.index({ popularidade: -1 });

// Middleware para garantir nome único em lowercase
TagSchema.pre('save', async function(next) {
  const tag = this as ITag;
  
  // Converter para lowercase
  tag.nome = tag.nome.toLowerCase();
  
  // Verificar se já existe tag com mesmo nome (case insensitive)
  const existingTag = await mongoose.models.Tag.findOne({
    nome: tag.nome,
    _id: { $ne: tag._id }
  });
  
  if (existingTag) {
    return next(new Error(`Tag "${tag.nome}" já existe`));
  }
  
  next();
});

export default mongoose.model<ITag>('Tag', TagSchema);