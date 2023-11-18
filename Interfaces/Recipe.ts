export interface RecipeInterface {
    periodoRef: string
    titulo: string
    ingredientes: [{
        nome: string,
        qtd: string
}],
    calorias: number
    carboidratos: number
    gordura: number
    proteína: number
    user: string
    modoDePreparo: string
    image: string
    descricao: string
}
