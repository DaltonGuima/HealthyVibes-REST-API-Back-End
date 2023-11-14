import 'dotenv/config';

export const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

export const url = process.env.MONGODB_URI || `mongodb+srv://${DB_USER}:${DB_PASSWORD}@healthyvibes.crnjfip.mongodb.net/?retryWrites=true&w=majority`
