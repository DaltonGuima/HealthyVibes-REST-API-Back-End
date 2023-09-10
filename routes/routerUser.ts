import { Router } from "express"
import { User } from "../models/user"
import { ErrorDescription } from "mongodb"


export const userRouter = Router()

userRouter.post('/', async (request, response) => {
    //req.body
    const { nome, email, senha, recipes } = request.body


    const user = {
        nome,
        email,
        senha,
        recipes
    }

    try {

        await User.create(user)

        response.status(201).json({ message: 'Usuário inserido no sistema' })

    } catch (error: unknown) {

        if ((error as ErrorDescription).code == 11000 && (error as ErrorDescription).keyPattern.email == 1)
            return response.status(500).json({ message: "Email já cadastrado" })

        response.status(500).json({ error: error })
    }
})

userRouter.get('/', async (request, response) => {
    try {

        const users = await User.find().populate({
            path: 'recipes',
            select: { "_id": 0 }
        })

        response.status(200).json(users)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

userRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {
        // findONe({ _id: id})
        const user = await User.findById(id)

        if (!user) {
            return response.status(422).json({ message: 'O usuário não foi encontrado' })

        }
        response.status(200).json(user)

    } catch (error) {
        response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

userRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro


    const { nome, email, senha, recipes } = request.body


    const user = {
        nome,
        email,
        senha,
        recipes
    }

    try {

        await User.findByIdAndUpdate(id, user)


        response.status(200).json(user)

    } catch (error: unknown) {

        if ((error as ErrorDescription).code == 11000 && (error as ErrorDescription).keyPattern.email == 1)
            return response.status(500).json({ message: "Email já cadastrado" })

        response.status(500).json({ error: error })
    }
})

userRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const user = await User.findById(id)

    if (!user) {
        return response.status(422).json({ message: 'O usuário não foi encontrado' })
    }

    try {

        await User.findByIdAndDelete(id)

        response.status(200).json({ message: 'Usuário deletado' })
    } catch (error) {
        response.status(500).json({ error: error })
    }
})

