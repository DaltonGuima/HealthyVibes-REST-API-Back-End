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
    exercises: [{
        exercise: {
            type: mongoose.Types.ObjectId,
            ref: 'Exercise',
        },
        done: Boolean
    }],
    role: {
        type: String,
        enum: ["normal", "admin"],
        required: [true, "Informe a role"]
    }


},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
)

schema.virtual('imcs', {
    ref: 'Imc',
    localField: '_id',
    foreignField: 'user'
}
)

schema.virtual('diets', {
    ref: 'Diet',
    localField: '_id',
    foreignField: 'user'
})

schema.virtual('consumptions', {
    ref: 'Consumption',
    localField: '_id',
    foreignField: 'user'
})

export const User = mongoose.model('User', schema)