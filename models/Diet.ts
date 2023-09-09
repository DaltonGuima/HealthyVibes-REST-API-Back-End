import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    nome: String

}, { timestamps: true })

export const Diet = mongoose.model('Diet', schema)
