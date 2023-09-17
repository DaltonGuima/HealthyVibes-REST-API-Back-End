import { Router } from "express"
import { Diet } from "../models/Diet"
import { DietInterface } from "../Interfaces/Diet"
import { UserInterface } from "../Interfaces/User";
import { verifyToken } from "../middlewares/authJWT";




export const dietRouter = Router()

dietRouter.post('/', async (request, response) => {
    //req.body
    const diet: DietInterface = request.body
    const token = await verifyToken(request.headers.authorization)


    if (token) {
        try {

            if ((token as UserInterface).role == "normal") {
                if (diet.user == null || diet.user == (token as UserInterface).id)
                    diet.user = (token as UserInterface).id
                else
                    return response.status(403).json({ message: "Você não pode inserir dieta, de outro usuário" })
            }

            const savedDiet = await Diet.create(diet)

            return response.status(201).json({
                savedID: savedDiet.id,
                message: 'Dieta inserida no sistema'
            })

        } catch (error) {
            return response.status(500).json({ error: error })
        }
    } else {
        return response.status(401).json({ message: "Token Inválido" })
    }
})

dietRouter.get('/', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {

                const diets = await Diet.find()
                return response.status(200).json(diets)

            } catch (error) {
                return response.status(500).json({ error: error })
            }
        } else {
            return response.status(403).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(401).json({ message: "Token Inválido" })
    }
})

dietRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const token = await verifyToken(request.headers.authorization)

    try {
        // findONe({ _id: id})
        const diet = await Diet.findById(id).populate('recipes')

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