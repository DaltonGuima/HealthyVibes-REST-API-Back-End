import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    periodoRef: {
        type: String,
        enum: [
            "Café da Manhã", "Almoço",
            "Lanche", "Janta"
        ],
        required: [true, "É necessário informar o período de refeição"]
    },
    titulo: {
        type: String,
        required: [true, "Titulo não informado"]
    },
    ingredientes: [{
        nome: String,
        qtd: String
    }],
    calorias: Number,
    carboidratos: Number,
    gordura: Number,
    proteína: Number,
    modoDePreparo: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    }

}, { timestamps: true })

export const Recipe = mongoose.model('Recipe', schema)

