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
    /*     recipes: [{
            type: mongoose.Types.ObjectId,
            ref: 'Recipe'
        }], */
    exercises: [{
        type: mongoose.Types.ObjectId,
        ref: 'Exercise'
    }],
    imcs: [{
        type: mongoose.Types.ObjectId,
        ref: 'Imc'
    }],
    diets: [{
        type: mongoose.Types.ObjectId,
        ref: 'Diet'
    }],
    consumptions: [{
        type: mongoose.Types.ObjectId,
        ref: 'Consumption'
    }],
    role: {
        type: String,
        enum: ["normal", "admin"],
        required: [true, "Informe a role"]
    }


}, { timestamps: true })

export const User = mongoose.model('User', schema)