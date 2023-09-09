import { Router } from "express"
import { Consumption } from "../models/Consumption"




export const consumptionRouter = Router()

consumptionRouter.post('/', async (request, response) => {
    //req.body
    const { aguaMl, calorias } = request.body

    if (!aguaMl) {
        return response.status(422).json({ error: 'A quantidade de água consumida em Ml é obrigatória!' })
        return
    }

    if (!calorias) {
        return response.status(422).json({ error: 'A quantidade de calorias consumidas é obrigatória!' })
        return
    }

    const consumption = {
        aguaMl,
        calorias
    }

    try {

        await Consumption.create(consumption)

        response.status(201).json({ message: 'Valores de consumo inseridos no sistema' })

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

consumptionRouter.get('/', async (request, response) => {
    try {

        const consumptions = await Consumption.find()

        response.status(200).json(consumptions)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

consumptionRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {
        // findONe({ _id: id})
        const consumption = await Consumption.findById(id)

        if (!consumption) {
            return response.status(422).json({ message: 'Valores de consumo não foram encontrados' })

        }
        response.status(200).json(consumption)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

consumptionRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro

    const { aguaMl, calorias } = request.body

    const consumption = {
        aguaMl,
        calorias
    }

    try {

        await Consumption.findByIdAndUpdate(id, consumption)


        response.status(200).json(consumption)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

consumptionRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const consumption = await Consumption.findById(id)

    if (!consumption) {
        return response.status(422).json({ message: 'Este valor de consumo não foi encontrado' })
    }

    try {

        await Consumption.findByIdAndDelete(id)

        response.status(200).json({ message: 'Valor de consumo deletado' })
    } catch (error) {
        response.status(500).json({ error: error })
    }
})