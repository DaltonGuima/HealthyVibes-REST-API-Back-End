// import mongoose from "mongoose";

export interface RecipeInterface {
    periodoRef: string
    titulo: string
    ingredientes: [
        nome: string,
        qtd: string
    ],
    calorias: number
    carboidratos: number
    gordura: number
    proteína: number
    // createdByUser: boolean
    user: string
}
