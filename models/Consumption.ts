// Tanto o de agua como o de calorias por aqui
import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    aguaMl: Number,
    calorias: Number

}, { timestamps: true })

export const Consumption = mongoose.model('Consumption', schema)