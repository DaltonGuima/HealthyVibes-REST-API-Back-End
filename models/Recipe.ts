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
    createdByUser: {
        type: Boolean,
        required: [true, "É necessário informar se foi criado por usuário"]
    }

}, { timestamps: true })

export const Recipe = mongoose.model('Recipe', schema)

