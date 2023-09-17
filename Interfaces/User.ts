

export interface UserInterface {
    _id: string,
    nom: string,
    email: string,
    senha: string,
    role: string,
    exercises: [{ _id: string, done: boolean }],

}