import mongoose from "mongoose";

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

const PessoaSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  curso: { type: String, default: null, trim: true },
  data_nasc: { type: Date, required: true },
  periodo: { type: String, default: null },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  genero: { type: String, enum: ["masculino", "feminino", "não-binário", "outro"], required: true },
  sexualidade: { type: String, enum: ["hetero", "gay", "bi", "pan", "assexual", "outro"], required: true },
  descricao: { type: String, maxlength: 300, default: "" },
  ativo: { type: Boolean, default: true },
  instagram: String,
  whatsapp: String,
  telegram: String,
  tags: { type: [TagItemSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Pessoa', PessoaSchema);