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
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })

export const Diet = mongoose.model('Diet', schema)
