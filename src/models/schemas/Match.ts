// models/schemas/Match.ts
import mongoose from "mongoose";

export interface IMatch extends mongoose.Document {
  pessoa_1_id: mongoose.Types.ObjectId;
  pessoa_2_id: mongoose.Types.ObjectId;
  match_pessoa_1: boolean;
  match_pessoa_2: boolean;
  match_completo: boolean;
  data_match: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new mongoose.Schema<IMatch>({
  pessoa_1_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: [true, 'ID da pessoa 1 é obrigatório']
  },
  pessoa_2_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: [true, 'ID da pessoa 2 é obrigatório'],
    validate: {
      validator: function(value: mongoose.Types.ObjectId) {
        return !this.pessoa_1_id.equals(value);
      },
      message: 'Uma pessoa não pode dar match consigo mesma'
    }
  },
  match_pessoa_1: {
    type: Boolean,
    default: false
  },
  match_pessoa_2: {
    type: Boolean,
    default: false
  },
  match_completo: {
    type: Boolean,
    default: false
  },
  data_match: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

// Índices compostos para performance
MatchSchema.index({ pessoa_1_id: 1, pessoa_2_id: 1 }, { unique: true });
MatchSchema.index({ pessoa_1_id: 1, match_completo: 1 });
MatchSchema.index({ pessoa_2_id: 1, match_completo: 1 });
MatchSchema.index({ match_completo: 1, createdAt: -1 });
MatchSchema.index({ data_match: -1 });

// Middleware para atualizar match_completo e data_match
MatchSchema.pre('save', function(next) {
  const match = this as IMatch;
  
  // Verificar se é um match completo (ambos deram like)
  if (match.match_pessoa_1 && match.match_pessoa_2) {
    match.match_completo = true;
    
    // Definir data do match apenas na primeira vez
    if (!match.data_match) {
      match.data_match = new Date();
    }
  } else {
    match.match_completo = false;
    match.data_match = null;
  }
  
  next();
});

// Validação para evitar duplicatas invertidas (A-B e B-A)
MatchSchema.pre('save', async function(next) {
  const match = this as IMatch;
  
  // Verificar se já existe match inverso
  const existingInverse = await mongoose.model('Match').findOne({
    $or: [
      { pessoa_1_id: match.pessoa_1_id, pessoa_2_id: match.pessoa_2_id },
      { pessoa_1_id: match.pessoa_2_id, pessoa_2_id: match.pessoa_1_id }
    ],
    _id: { $ne: match._id }
  });
  
  if (existingInverse) {
    return next(new Error('Match entre estas pessoas já existe'));
  }
  
  next();
});

export default mongoose.model<IMatch>('Match', MatchSchema);