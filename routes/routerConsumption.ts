import { Router } from "express"
import { Consumption } from "../models/Consumption"
import { ConsumptionInterface } from "../Interfaces/Consumption"




export const consumptionRouter = Router()

consumptionRouter.post('/', async (request, response) => {

    const consumption: ConsumptionInterface = request.body

    try {

        const savedConsumption = await Consumption.create(consumption)
        return response.status(201).json({
            saveID: savedConsumption.id,
            message: 'Valor de consumo inserido no sistema'
        })

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

consumptionRouter.get('/', async (request, response) => {
    try {

        const consumptions = await Consumption.find()

        return response.status(200).json(consumptions)

    } catch (error) {
        return response.status(500).json({ error: error })
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
        return response.status(200).json(consumption)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

consumptionRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro

    const consumption: ConsumptionInterface = request.body

    try {

        await Consumption.findByIdAndUpdate(id, consumption)


        return response.status(200).json(consumption)


    } catch (error) {
        return response.status(500).json({ error: error })
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

        return response.status(200).json({ message: 'Valor de consumo deletado' })
    } catch (error) {
        return response.status(500).json({ error: error })
    }
})