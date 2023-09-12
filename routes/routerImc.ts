import { Router } from "express"
import { Imc } from "../models/Imc"
import { ImcInterface } from "../Interfaces/Imc"


export const imcRouter = Router()

imcRouter.post('/', async (request, response) => {
    //req.body
    const imc: ImcInterface = request.body

    if (!imc.peso || !imc.altura) {
        return response.status(500).json({ message: "Altura e/ou peso não inseridos" })
    }

    const IMCvalue = {
        ...imc,
        valor: (((imc.peso / Math.pow(imc.altura, 2))) * 10000).toFixed(2)
    }

    try {

        const savedIMC = await Imc.create(IMCvalue)
        return response.status(201).json({
            savedID: savedIMC.id,
            message: 'Imc definido!'
        })

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

imcRouter.get('/', async (request, response) => {
    try {

        const imcs = await Imc.find()

        response.status(200).json(imcs)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

imcRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {
        // findONe({ _id: id})
        const imc = await Imc.findById(id)

        if (!imc) {
            return response.status(422).json({ message: 'Este valor de imc não foi encontrado' })

        }
        response.status(200).json(imc)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

imcRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro
    const imc: ImcInterface = request.body

    if (!imc.peso || !imc.altura) {
        return response.status(500).json({ message: "Altura e/ou peso não inseridos" })
    }

    const IMCvalue = {
        ...imc,
        valor: (((imc.peso / Math.pow(imc.altura, 2))) * 10000).toFixed(2)
    }

    try {

        await Imc.findByIdAndUpdate(id, IMCvalue)

        return response.status(200).json(IMCvalue)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

imcRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const imc = await Imc.findById(id)

    if (!imc) {
        return response.status(422).json({ message: 'O imc não foi encontrado' })
    }

    try {

        await Imc.findByIdAndDelete(id)

        response.status(200).json({ message: 'Imc deletado' })
    } catch (error) {
        response.status(500).json({ error: error })
    }
})