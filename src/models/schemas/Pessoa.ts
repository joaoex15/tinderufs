// models/schemas/Pessoa.ts
import mongoose from "mongoose";

export interface IPessoa extends mongoose.Document {
  nome: string;
  curso: string | null;
  data_nasc: Date;
  periodo: string | null;
  email: string;
  genero: "masculino" | "feminino" | "não-binário" | "outro";
  sexualidade: "hetero" | "gay" | "bi" | "pan" | "assexual" | "outro";
  descricao: string;
  ativo: boolean;
  instagram?: string;
  whatsapp?: string;
  telegram?: string;
  tags: Array<{ tag_id?: mongoose.Types.ObjectId; nome: string }>;
  usuario_id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TagItemSchema = new mongoose.Schema({
  tag_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: false
  },
  nome: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const PessoaSchema = new mongoose.Schema<IPessoa>({
  nome: { 
    type: String, 
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres']
  },
  curso: { 
    type: String, 
    default: null, 
    trim: true 
  },
  data_nasc: { 
    type: Date, 
    required: [true, 'Data de nascimento é obrigatória'],
    validate: {
      validator: function(value: Date) {
        // Validar que a pessoa tem pelo menos 18 anos
        const idadeMinima = new Date();
        idadeMinima.setFullYear(idadeMinima.getFullYear() - 18);
        return value <= idadeMinima;
      },
      message: 'É necessário ter pelo menos 18 anos'
    }
  },
  periodo: { 
    type: String, 
    default: null 
  },
  email: { 
    type: String, 
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, informe um email válido']
  },
  genero: { 
    type: String, 
    enum: {
      values: ["masculino", "feminino", "não-binário", "outro"],
      message: 'Gênero inválido'
    },
    required: [true, 'Gênero é obrigatório']
  },
  sexualidade: { 
    type: String, 
    enum: {
      values: ["hetero", "gay", "bi", "pan", "assexual", "outro"],
      message: 'Sexualidade inválida'
    },
    required: [true, 'Sexualidade é obrigatória']
  },
  descricao: { 
    type: String, 
    maxlength: [300, 'Descrição não pode exceder 300 caracteres'], 
    default: "" 
  },
  ativo: { 
    type: Boolean, 
    default: true 
  },
  instagram: { 
    type: String, 
    trim: true,
    match: [/^@?[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/, 'Instagram inválido']
  },
  whatsapp: { 
    type: String, 
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'WhatsApp inválido']
  },
  telegram: { 
    type: String, 
    trim: true,
    match: [/^@[a-zA-Z0-9_]{5,32}$/, 'Telegram inválido (use @usuario)']
  },
  tags: { 
    type: [TagItemSchema], 
    default: [],
    validate: {
      validator: function(tags: any[]) {
        return tags.length <= 20; // Limite de tags por pessoa
      },
      message: 'Não é possível adicionar mais de 20 tags'
    }
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'ID do usuário é obrigatório'],
    unique: true // Uma pessoa por usuário
  }
}, { 
  timestamps: true 
});

// Índices
PessoaSchema.index({ email: 1 }, { unique: true });
PessoaSchema.index({ ativo: 1 });
PessoaSchema.index({ genero: 1, sexualidade: 1 });
PessoaSchema.index({ curso: 1, periodo: 1 });
PessoaSchema.index({ usuario_id: 1 }, { unique: true });
PessoaSchema.index({ 'tags.nome': 1 });

// Middleware para garantir consistência
PessoaSchema.pre('save', function(next) {
  // Garantir que o email está em lowercase
  this.email = this.email.toLowerCase();
  
  // Limpar espaços em branco
  if (this.nome) this.nome = this.nome.trim();
  if (this.curso) this.curso = this.curso.trim();
  
  next();
});

export default mongoose.model<IPessoa>('Pessoa', PessoaSchema);