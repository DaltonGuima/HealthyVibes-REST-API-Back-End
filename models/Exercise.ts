import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: String,
    salary: Number,
    approved: Boolean
})

export const Person = mongoose.model('Person', schema)