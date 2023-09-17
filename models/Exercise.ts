import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Nome necessário"]
    },
    descricao: String,
    video: String
}, { timestamps: true })

export const Exercise = mongoose.model('Exercise', schema)