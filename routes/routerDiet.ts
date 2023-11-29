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

            if (diet.user == null) {
                diet.user = (token as UserInterface).id
            }

            if ((token as UserInterface).role == "normal" && diet.user != (token as UserInterface).id)
                return response.status(401).json({ message: "Você não pode inserir dieta, de outro usuário" })

            const savedDiet = await Diet.create(diet)

            return response.status(201).json({
                savedID: savedDiet.id,
                message: 'Dieta inserida no sistema'
            })

        } catch (error) {
            return response.status(500).json({ error: error })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
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
            return response.status(401).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

dietRouter.get('/myDiets', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)

    if (token) {

        try {

            const diets = await Diet.find({ user: (token as UserInterface).id })
            return response.status(200).json(diets)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

dietRouter.get('/:id', async (request, response) => {
    const id = request.params.id
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        try {
            // findONe({ _id: id})
            const diet = await Diet.findById(id).populate({
                path: 'recipes',
                model: 'Recipe',
                populate: {
                    path: 'image',
                    model: 'Image',
                }
            })

            if (!diet) {
                return response.status(422).json({ message: 'A dieta não foi encontrada' })

            }

            if (diet.user == (token as UserInterface).id || (token as UserInterface).role == "admin")
                return response.status(200).json(diet)
            else {
                return response.status(401).json({ message: "Você não possui este acesso" })
            }

        } catch (error) {
            return response.status(500).json({ error: error })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

// Update - atualização de dados (PUT, PATch)

dietRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const dietUserId = await Diet.findById(id).select({ user: 1 })

    const diet: DietInterface = request.body
    if (token) {
        if (
            (diet.user && (dietUserId?.user != diet.user))
            && (token as UserInterface).role == "normal"
        )
            return response.status(401).json({ message: "Você não possui este acesso" })
        try {

            await Diet.findByIdAndUpdate(id, diet)

            return response.status(200).json(diet)

        } catch (error) {
            return response.status(500).json({ error: error })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

dietRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const token = await verifyToken(request.headers.authorization)
    const diet = await Diet.findById(id)

    if (!diet) {
        return response.status(422).json({ message: 'A dieta não foi encontrada' })
    }

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == diet.user) {
            try {
                // Botar um código para excluir receitas, dessa dieta
                await Diet.findByIdAndDelete(id)

                return response.status(200).json({ message: 'Dieta deletada' })
            } catch (error) {
                return response.status(500).json({ error: error })
            }
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})
