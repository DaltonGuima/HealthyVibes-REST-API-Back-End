import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    valor: Number,
    peso: {
        type: Number,
        required: [true, "Peso necessário"]
    },
    altura: {
        type: Number,
        required: [true, "Altura necessária"],
        validate: {
            validator: Number.isInteger,
            message: "Altura só valor inteiro"
        }
    }

}, { timestamps: true })

export const Imc = mongoose.model('Imc', schema)