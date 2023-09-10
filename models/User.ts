import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Usuário sem nome"]
    },
    email: {
        type: String,
        validate: {
            validator: (v: string) => {
                return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: "Email inválido"
        },
        unique: true,
        required: [true, "Usuário sem Email"]
    },
    senha: {
        type: String,
        required: [true, "Usuário sem senha"]
    },
    recipes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Recipe'
    }]

}, { timestamps: true })

export const User = mongoose.model('User', schema)