import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    titulo: String

}, { timestamps: true })

export const Recipe = mongoose.model('Recipe', schema)

