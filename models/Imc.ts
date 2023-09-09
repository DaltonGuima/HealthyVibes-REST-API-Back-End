import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    valor: Number,
    peso: Number,
    altura: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: "Altura só valor inteiro"
        }
    }

}, { timestamps: true })

export const Imc = mongoose.model('Imc', schema)