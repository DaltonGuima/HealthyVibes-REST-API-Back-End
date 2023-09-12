// Tanto o de agua como o de calorias por aqui
// Tem que fazer meio que uma genaralização aqui
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    quantidade: Number,
    tipoConsumo: {
        type: String,
        enum: ["Água", "Calorias"]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Usuário necessário"]
    }
}, { timestamps: true })

export const Consumption = mongoose.model('Consumption', schema)