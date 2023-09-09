import { Router } from "express"
import { Diet } from "../models/Diet"




export const dietRouter = Router()

dietRouter.post('/', async (request, response) => {
    //req.body
    const { nome } = request.body

    if (!nome) {
        return response.status(422).json({ error: 'O nome é obrigatório!' })
        return
    }

    const diet = {
        nome
    }

    try {

        await Diet.create(diet)

        response.status(201).json({ message: 'Dieta inserida no sistema' })

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

dietRouter.get('/', async (request, response) => {
    try {

        const diets = await Diet.find()

        response.status(200).json(diets)

    } catch (error) {
        response.status(500).json({ error: error })
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
        response.status(200).json(diet)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

dietRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro

    const { nome } = request.body

    const diet = {
        nome
    }

    try {

        await Diet.findByIdAndUpdate(id, diet)


        response.status(200).json(diet)

    } catch (error) {
        response.status(500).json({ error: error })
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

        response.status(200).json({ message: 'Dieta deletada' })
    } catch (error) {
        response.status(500).json({ error: error })
    }
})