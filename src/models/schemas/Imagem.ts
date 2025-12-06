// models/schemas/Imagem.ts
import mongoose from 'mongoose';

export interface IImagem extends mongoose.Document {
  pessoa_id: mongoose.Types.ObjectId;
  caminho_arquivo: string;
  ordem: number;
  principal: boolean;
  aprovada: boolean;
  motivo_rejeicao?: string;
  createdAt: Date;
}

const ImagemSchema = new mongoose.Schema<IImagem>({
  pessoa_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: [true, 'ID da pessoa é obrigatório']
  },
  caminho_arquivo: {
    type: String,
    required: [true, 'Caminho do arquivo é obrigatório'],
    trim: true
  },
  ordem: {
    type: Number,
    default: 0,
    min: [0, 'Ordem não pode ser negativa'],
    max: [9, 'Máximo de 10 imagens por pessoa']
  },
  principal: {
    type: Boolean,
    default: false
  },
  aprovada: {
    type: Boolean,
    default: true // Ou false se precisar de moderação
  },
  motivo_rejeicao: {
    type: String,
    trim: true
  }
}, { 
  timestamps: { createdAt: true, updatedAt: false }
});

// Índices
ImagemSchema.index({ pessoa_id: 1, principal: 1 });
ImagemSchema.index({ pessoa_id: 1, ordem: 1 });
ImagemSchema.index({ pessoa_id: 1, aprovada: 1 });
ImagemSchema.index({ createdAt: -1 });

// Middleware para garantir apenas uma imagem principal por pessoa
ImagemSchema.pre('save', async function(next) {
  const imagem = this as IImagem;
  
  if (imagem.principal) {
    try {
      // Remover status principal de outras imagens da mesma pessoa
      await mongoose.model('Imagem').updateMany(
        { 
          pessoa_id: imagem.pessoa_id, 
          _id: { $ne: imagem._id },
          principal: true 
        },
        { $set: { principal: false } }
      );
    } catch (error: any) {
      return next(error);
    }
  }
  
  next();
});

// Validação: Máximo de 10 imagens por pessoa
ImagemSchema.pre('save', async function(next) {
  const imagem = this as IImagem;
  
  if (!imagem.isNew) return next();
  
  try {
    const totalImagens = await mongoose.model('Imagem').countDocuments({
      pessoa_id: imagem.pessoa_id
    });
    
    if (totalImagens >= 10) {
      return next(new Error('Limite máximo de 10 imagens por pessoa'));
    }
  } catch (error: any) {
    return next(error);
  }
  
  next();
});

export default mongoose.model<IImagem>('Imagem', ImagemSchema);