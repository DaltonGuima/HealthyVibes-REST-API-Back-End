import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    nome: {
        type: String,
        required: [true, "Nome é necessário"]
    },
    recipes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Recipe'
    }],
    descricao: String,
    opcaoPeso: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Usuário necessário"]
    }

}, { timestamps: true })

export const Diet = mongoose.model('Diet', schema)
