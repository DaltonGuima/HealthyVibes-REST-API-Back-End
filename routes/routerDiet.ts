import { Router } from "express"
import { Diet } from "../models/Diet"
import { DietInterface } from "../Interfaces/Diet"




export const dietRouter = Router()

dietRouter.post('/', async (request, response) => {
    //req.body
    const diet: DietInterface = request.body

    try {

        const savedDiet = await Diet.create(diet)

        return response.status(201).json({
            savedID: savedDiet.id,
            message: 'Dieta inserida no sistema'
        })

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

dietRouter.get('/', async (request, response) => {
    try {

        const diets = await Diet.find()

        return response.status(200).json(diets)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

dietRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {
        // findONe({ _id: id})
        const diet = await Diet.findById(id)

        if (!diet) {
            return response.status(422).json({ message: 'A dieta não foi encontrada' })

        }
        return response.status(200).json(diet)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

dietRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro

    const diet: DietInterface = request.body

    try {

        await Diet.findByIdAndUpdate(id, diet)

        return response.status(200).json(diet)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

dietRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const diet = await Diet.findById(id)

    if (!diet) {
        return response.status(422).json({ message: 'A dieta não foi encontrada' })
    }

    try {

        await Diet.findByIdAndDelete(id)

        return response.status(200).json({ message: 'Dieta deletada' })
    } catch (error) {
        return response.status(500).json({ error: error })
    }
})