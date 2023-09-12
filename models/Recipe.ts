import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    periodoRef: {
        type: String,
        enum: [
            "Café da Manhã", "Almoço",
            "Lanche", "Janta"
        ],
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    ingredientes: [{
        nome: String,
        qtd: String
    }],
    calorias: Number,
    carboidratos: Number,
    gordura: Number,
    proteína: Number,
    createdByuser: Boolean

}, { timestamps: true })

export const Recipe = mongoose.model('Recipe', schema)

