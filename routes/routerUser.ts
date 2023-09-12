import { Router } from "express"
import { User } from "../models/User"
import { ErrorDescription } from "mongodb"
import bcrypt from "bcryptjs";
import { UserInterface } from "../Interfaces/User";


export const userRouter = Router()

userRouter.post('/', async (request, response) => {
    //req.body
    const user: UserInterface = request.body
    const senhaHash = await bcrypt.hash(user.senha, 10)
    user.senha = senhaHash

    try {

        const savedUser = await User.create(user)

        return response.status(201).json({
            savedID: savedUser.id,
            message: 'Usuário inserido no sistema'
        })

    } catch (error: unknown) {

        if ((error as ErrorDescription).code == 11000 && (error as ErrorDescription).keyPattern.email == 1)
            return response.status(500).json({
                error: error,
                message: "Email já cadastrado"
            })

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

    const user: UserInterface = request.body
    const senhaHash = await bcrypt.hash(user.senha, 10)
    user.senha = senhaHash

    try {

        await User.findByIdAndUpdate(id, user)


        return response.status(200).json(user)

    } catch (error: unknown) {

        if ((error as ErrorDescription).code == 11000 && (error as ErrorDescription).keyPattern.email == 1)
            return response.status(500).json({
                error: error,
                message: "Email já cadastrado"
            })

        return response.status(500).json({ error: error })
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

        return response.status(200).json({ message: 'Usuário deletado' })
    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

