import { Router } from "express"
import { Recipe } from "../models/Recipe"




export const recipeRouter = Router()

recipeRouter.post('/', async (request, response) => {
    //req.body
    const {
        titulo,
        ingredientes,
        calorias,
        carboidratos,
        gordura,
        proteína,
        user
    } = request.body

    if (!titulo) {
        return response.status(422).json({ error: 'O título é obrigatório!' })
        return
    }

    const recipe = {
        titulo,
        ingredientes,
        calorias,
        carboidratos,
        gordura,
        proteína,
        user
    }

    try {

        await Recipe.create(recipe)

        response.status(201).json({ message: 'Receita inserida no sistema' })

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

recipeRouter.get('/', async (request, response) => {
    try {

        const recipes = await Recipe.find()

        response.status(200).json(recipes)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

recipeRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {
        // findONe({ _id: id})
        const recipe = await Recipe.findById(id)

        if (!recipe) {
            return response.status(422).json({ message: 'A receita não foi encontrada' })

        }
        response.status(200).json(recipe)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

recipeRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro

    const {
        titulo,
        ingredientes,
        calorias,
        carboidratos,
        gordura,
        proteína,
        user
    } = request.body

    const recipe = {
        titulo,
        ingredientes,
        calorias,
        carboidratos,
        gordura,
        proteína,
        user
    }

    try {

        await Recipe.findByIdAndUpdate(id, recipe)


        response.status(200).json(recipe)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

recipeRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const recipe = await Recipe.findById(id)

    if (!recipe) {
        return response.status(422).json({ message: 'A receita não foi encontrada' })
    }

    try {

        await Recipe.findByIdAndDelete(id)

        response.status(200).json({ message: 'Receita deletada' })
    } catch (error) {
        response.status(500).json({ error: error })
    }
})