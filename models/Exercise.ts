import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Nome necessário"]
    },
    descricao: String,
    video: String,
    areas: String,
    intensidade: Number,
    sets: String,
    duracao: {
        type: String,
        enum: ["Curto", "Longo"]
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    }
}, { timestamps: true })

export const Exercise = mongoose.model('Exercise', schema)