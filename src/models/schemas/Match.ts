import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  pessoa_1_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: true
  },
  pessoa_2_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pessoa',
    required: true
  },
  match: { type: Boolean, default: false }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: false }
});