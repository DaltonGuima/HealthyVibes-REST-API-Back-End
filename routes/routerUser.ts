import { Router } from "express"
import { User } from "../models/User"
import { ErrorDescription } from "mongodb"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInterface } from "../Interfaces/User";
import 'dotenv/config';
import { verifyToken } from "../middlewares/authJWT";
import { Exercise } from "../models/Exercise";


export const userRouter = Router()

userRouter.post('/', async (request, response) => {
    //req.body
    const token = await verifyToken(request.headers.authorization)
    const user: UserInterface = request.body

    if (user.senha) {
        const senhaHash = await bcrypt.hash(user.senha, 10)
        user.senha = senhaHash
    }


    try {
        // || (token as UserInterface).role == "normal"
        if (!token) {
            /*             if (user.role == "admin")
                            return response.status(403).json({ message: "Você não pode definir role como admin" })
                        else */
            user.role = "normal"
        }


        const savedUser = await User.create(user)

        return response.status(201).json({
            savedID: savedUser.id,
            message: 'Usuário inserido no sistema'
        })

    } catch (error) {

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
            return response.status(401)
                .json({
                    message: 'O usuário Inválido.'
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
                    message: "Senha inválida"
                });
        }

        const token = jwt.sign({
            id: userFound.id
        }, process.env.API_SECRET || "", {
            expiresIn: 86400
        });


        return response.status(200)
            .json({
                user: userFound.id,
                message: "Logado com sucesso",
                accessToken: `JWT ${token}`,
                userName: userFound.nome
            })


    }
    catch (error) {
        return response.status(500)
            .json({
                message: error
            });

    }


})


userRouter.post('/verifyPasswrod', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)
    const user: UserInterface = request.body

    if (token) {

        if (!user.senha)
            return response.status(404)
                .json({
                    message: 'Senha não informada.'
                });

        const passwordIsValid = bcrypt.compareSync(
            user.senha,
            (token as UserInterface).senha || ""
        );

        if (!passwordIsValid) {
            return response.status(401)
                .json({
                    accessToken: null,
                    message: "Senha inválida"
                });
        }

        return response.status(200)
            .json({
                message: "Senha válida"
            })


    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

userRouter.get('/', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {

                const users = await User.find()
                return response.status(200).json(users)

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

userRouter.get('/myuser', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)

    if (token) {

        try {

            const user = await User.findById((token as UserInterface).id)
            return response.status(200).json(user)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(400).json({ message: "Token Inválido ou expirado" })
    }
})

userRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == id) {
            try {

                const user = await User.findById(id)


                if (!user) {
                    return response.status(422).json({ message: 'O usuário não foi encontrado.' })

                }
                return response.status(200).json(user)

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


userRouter.get('/:id/diets', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == id) {
            try {



                const user = await User.findById(id).populate('diets')

                if (!user) {
                    return response.status(422).json({ message: 'O usuário não foi encontrado' })

                }

                return response.status(200).json(user)

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

userRouter.get('/:id/imcs', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == id) {
            try {

                const user = await User.findById(id).populate('imcs')


                if (!user) {
                    return response.status(422).json({ message: 'O usuário não foi encontrado' })

                }
                return response.status(200).json(user)

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

userRouter.get('/:id/exercises', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == id) {
            try {

                const user = await User.findById(id).populate({
                    path: 'exercises',
                    populate: { path: 'exercise', model: Exercise }
                })


                if (!user) {
                    return response.status(422).json({ message: 'O usuário não foi encontrado' })

                }
                return response.status(200).json(user)

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

userRouter.get('/:id/consumptions', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == id) {
            try {

                const user = await User.findById(id).populate('consumptions')

                if (!user) {
                    return response.status(422).json({ message: 'O usuário não foi encontrado' })

                }
                return response.status(200).json(user)

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

// Update - atualização de dados (PUT, PATch)

userRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const user: UserInterface = request.body

    if (user.senha) {
        const senhaHash = await bcrypt.hash(user.senha, 10)
        user.senha = senhaHash
    }


    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == id) {

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
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

userRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const token = await verifyToken(request.headers.authorization)
    const user = await User.findById(id)

    if (!user) {
        return response.status(422).json({ message: 'O usuário não foi encontrado' })
    }

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == id) {

            try {

                await User.findByIdAndDelete(id)

                return response.status(200).json({ message: 'Usuário deletado' })
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



