export interface UserInterface {
    id: string,
    nome: string,
    email: string,
    senha: string,
    role: string,
    exercises: [{ _id: string, done: boolean }]
}