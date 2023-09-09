import { Router } from "express"
import { Exercise } from "../models/Exercise"


export const exerciseRouter = Router()

exerciseRouter.post('/', async (request, response) => {
    //req.body
    const { nome } = request.body

    if (!nome) {
        return response.status(422).json({ error: 'O nome é obrigatório!' })
        return
    }

    const exercise = {
        nome
    }

    try {

        await Exercise.create(exercise)

        response.status(201).json({ message: 'Exercício inserido no sistema' })

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

exerciseRouter.get('/', async (request, response) => {
    try {

        const exercise = await Exercise.find()

        response.status(200).json(exercise)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

exerciseRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {
        // findONe({ _id: id})
        const exercise = await Exercise.findById(id)

        if (!exercise) {
            return response.status(422).json({ message: 'O exercício não foi encontrado' })

        }
        response.status(200).json(exercise)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

exerciseRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro

    const { nome } = request.body

    const exercise = {
        nome
    }

    try {

        await Exercise.findByIdAndUpdate(id, exercise)


        response.status(200).json(exercise)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

exerciseRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const exercise = await Exercise.findById(id)

    if (!exercise) {
        return response.status(422).json({ message: 'O exercício não foi encontrado' })
    }

    try {

        await Exercise.findByIdAndDelete(id)

        response.status(200).json({ message: 'Exercício deletado' })
    } catch (error) {
        response.status(500).json({ error: error })
    }
})