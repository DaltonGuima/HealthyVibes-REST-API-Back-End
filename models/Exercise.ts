import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    nome: String

}, { timestamps: true })

export const Exercise = mongoose.model('Exercise', schema)