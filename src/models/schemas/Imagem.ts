import mongoose from 'mongoose';

const ImagemSchema = new mongoose.Schema({
  pessoa_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: true
  },
  caminho_arquivo: {
    type: String,
    required: true
  }
}, { 
  timestamps: { createdAt: true, updatedAt: false }
});

// ✅ Export padrão correto
export default mongoose.model('Imagem', ImagemSchema);