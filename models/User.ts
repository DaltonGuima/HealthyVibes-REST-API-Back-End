import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    nome: String,
    email: {
        type: String,
        validate: {
            validator: (v: string) => {
                return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: "Email inválido"
        },
        unique: true
    },
    senha: String

}, { timestamps: true })

export const User = mongoose.model('User', schema)