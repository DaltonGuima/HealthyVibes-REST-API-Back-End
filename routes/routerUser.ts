import { Router } from "express"
import { User } from "../models/User"
import { ErrorDescription } from "mongodb"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInterface } from "../Interfaces/User";
import 'dotenv/config';
import { verifyToken } from "../middlewares/authJWT";


export const userRouter = Router()

userRouter.post('/', async (request, response) => {
    //req.body
    const user: UserInterface = request.body
    const senhaHash = await bcrypt.hash(user.senha, 10)
    user.senha = senhaHash
    request.headers.authorization
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

        return response.status(500).json({ error: error })

    }
})

userRouter.post('/login', async (request, response) => {


    const user: UserInterface = request.body

    try {
        if (!user.senha)
            return response.status(404)
                .json({
                    message: 'Senha não informada.'
                });

        const userFound = await User.findOne({ email: user.email })

        if (!userFound) {
            return response.status(404)
                .json({
                    message: 'O usuário não foi encontrado.'
                });
        }

        const passwordIsValid = bcrypt.compareSync(
            user.senha,
            userFound.senha || ""
        );

        if (!passwordIsValid) {
            return response.status(401)
                .json({
                    accessToken: null,
                    message: "Invalid Password!"
                });
        }

        const token = jwt.sign({
            id: userFound.id
        }, `${process.env.API_SECRET ? process.env.API_SECRET : ""}`, {
            expiresIn: 86400
        });


        return response.status(200)
            .json({
                user: userFound.id,
                message: "Logado com sucesso",
                accessToken: token
            })


    }
    catch (error) {
        return response.status(500)
            .json({
                message: error
            });

    }


})


userRouter.get('/', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)

    if (token && (token as UserInterface).role == "admin"){
        console.log("Felicidade")
    }
    

    try {

        const users = await User.find()
        return response.status(200).json(users)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

userRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    try {

        const user = await User.findById(id)


        if (!user) {
            return response.status(422).json({ message: 'O usuário não foi encontrado.' })

        }
        return response.status(200).json(user)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})


userRouter.get('/:id/diets', async (request, response) => {
    const id = request.params.id

    try {

        const user = await User.findById(id).populate('diets')


        if (!user) {
            return response.status(422).json({ message: 'O usuário não foi encontrado' })

        }
        return response.status(200).json(user)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

userRouter.get('/:id/imcs', async (request, response) => {
    const id = request.params.id

    try {

        const user = await User.findById(id).populate('imcs')


        if (!user) {
            return response.status(422).json({ message: 'O usuário não foi encontrado' })

        }
        return response.status(200).json(user)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

userRouter.get('/:id/exercises', async (request, response) => {
    const id = request.params.id

    try {

        const user = await User.findById(id).populate('exercises')


        if (!user) {
            return response.status(422).json({ message: 'O usuário não foi encontrado' })

        }
        return response.status(200).json(user)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

userRouter.get('/:id/consumptions', async (request, response) => {
    const id = request.params.id

    try {

        const user = await User.findById(id).populate('consumptions')


        if (!user) {
            return response.status(422).json({ message: 'O usuário não foi encontrado' })

        }
        return response.status(200).json(user)

    } catch (error) {
        return response.status(500).json({ error: error })
    }
})

// Update - atualização de dados (PUT, PATch)

userRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro

    const user: UserInterface = request.body

    if (user.senha) {
        const senhaHash = await bcrypt.hash(user.senha, 10)
        user.senha = senhaHash
    }

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



