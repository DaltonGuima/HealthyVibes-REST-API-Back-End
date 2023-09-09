import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    nome: String,
    idade: Number
}, { timestamps: true })

export const User = mongoose.model('User', schema)