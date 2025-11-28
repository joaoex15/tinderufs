import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true }
});

// ✅ Export padrão correto
export default mongoose.model('Tag', TagSchema);