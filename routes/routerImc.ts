import { Router } from "express"
import { Imc } from "../models/Imc"


export const imcRouter = Router()

imcRouter.post('/', async (request, response) => {
    //req.body
    const {  peso, altura } = request.body

    if (!peso) {
        return response.status(422).json({ error: 'O peso é necessário!' })
        return
    }

    const imc = {
        valor : (((peso /Math.pow(altura,2)))*10000).toFixed(2),
        peso,
        altura
    }

    try {

        await Imc.create(imc)

        response.status(201).json({ message: 'Imc definido!' })

    } catch (error) {
        response.status(500).json({ error: error })
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

    const { peso, altura } = request.body

    if (!peso || !altura ) {
        return response.status(500).json({ message: "Altura e/ou peso não inseridos" })
    }

    const imc = {
        valor:  (((peso /Math.pow(altura,2)))*10000).toFixed(2),
        peso,
        altura

    }

    try {

        await Imc.findByIdAndUpdate(id, imc)


        return response.status(200).json(imc)

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