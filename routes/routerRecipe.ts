import { Router } from "express"
import { Recipe } from "../models/Recipe"
import { RecipeInterface } from "../Interfaces/Recipe"


export const recipeRouter = Router()

recipeRouter.post('/', async (request, response) => {
    //req.body
    const recipe: RecipeInterface = request.body

    try {

        const savedRecipe = await Recipe.create(recipe)

        return response.status(201).json({
            savedID: savedRecipe.id,
            message: 'Receita inserida no sistema'
        })

    } catch (error) {
        return response.status(500).json({ error: error })

    }
})

recipeRouter.get('/', async (request, response) => {
    try {

        const recipes = await Recipe.find()

        return response.status(200).json(recipes)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

recipeRouter.get('/noUsers', async (request, response) => {
    try {

        const recipes = await Recipe.find({ user: null })

        return response.status(200).json(recipes)

    } catch (error) {
        return response.status(500).json({ error: error })
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
        return response.status(200).json(recipe)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

recipeRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro

    const recipe: RecipeInterface = request.body

    try {

        await Recipe.findByIdAndUpdate(id, recipe)


        return response.status(200).json(recipe)

    } catch (error) {
        return response.status(500).json({ error: error })
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

        return response.status(200).json({ message: 'Receita deletada' })
    } catch (error) {
        return response.status(500).json({ error: error })
    }
})