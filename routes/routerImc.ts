import { Router } from "express"
import { ImcInterface } from "../Interfaces/Imc"
import { UserInterface } from "../Interfaces/User"
import { verifyToken } from "../middlewares/authJWT"
import { Imc } from "../models/Imc"


export const imcRouter = Router()

imcRouter.post('/', async (request, response) => {
    //req.body
    const imc: ImcInterface = request.body
    const token = await verifyToken(request.headers.authorization)

    if (!imc.peso || !imc.altura) {
        return response.status(500).json({ message: "Altura e/ou peso não inseridos" })
    }


    if (token) {
        try {

            if ((token as UserInterface).role == "normal") {
                if (imc.user == null || imc.user == (token as UserInterface).id)
                    imc.user = (token as UserInterface).id
                else
                    return response.status(401).json({ message: "Você não pode inserir imc, de outro usuário" })
            }

            const IMCvalue = {
                ...imc,
                valor: (((imc.peso / Math.pow(imc.altura, 2))) * 10000).toFixed(2)
            }

            const savedIMC = await Imc.create(IMCvalue)
            return response.status(201).json({
                savedID: savedIMC.id,
                message: 'Imc definido!'
            })

        } catch (error) {
            return response.status(500).json({ error: error })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

imcRouter.get('/', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {

            try {

                const imcs = await Imc.find()

                response.status(200).json(imcs)

            } catch (error) {
                response.status(500).json({ error: error })
            }
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

imcRouter.get('/myImcs', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)


    if (token) {

        try {

            const imcs = await Imc.find({ user: (token as UserInterface).id })
            return response.status(200).json(imcs)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }

})

imcRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)
    if (token) {
        try {
            // findONe({ _id: id})
            const imc = await Imc.findById(id)

            if (!imc) {
                return response.status(422).json({ message: 'Este valor de imc não foi encontrado' })

            }

            if (imc.user == (token as UserInterface).id || (token as UserInterface).role == "admin")
                return response.status(200).json(imc)
            else
                return response.status(401).json({ message: "Você não possui este acesso" })

        } catch (error) {
            response.status(500).json({ error: error })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})



// Update - atualização de dados (PUT, PATch)

imcRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro
    const imc: ImcInterface = request.body
    const token = await verifyToken(request.headers.authorization)
    const imcUserId = await Imc.findById(id).select({ user: 1 })

    if (!imc.peso || !imc.altura) {
        return response.status(500).json({ message: "Altura e/ou peso não inseridos" })
    }

    const IMCvalue = {
        ...imc,
        valor: (((imc.peso / Math.pow(imc.altura, 2))) * 10000).toFixed(2)
    }

    if (token) {
        if (
            (IMCvalue.user && (imcUserId?.user != IMCvalue.user))
            && (token as UserInterface).role == "normal"
        )
            return response.status(401).json({ message: "Você não possui este acesso" })

        try {

            await Imc.findByIdAndUpdate(id, IMCvalue)

            return response.status(200).json(IMCvalue)

        } catch (error) {
            return response.status(500).json({ error: error })
        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

imcRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const token = await verifyToken(request.headers.authorization)
    const imc = await Imc.findById(id)

    if (!imc) {
        return response.status(422).json({ message: 'O imc não foi encontrado' })
    }

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == imc.user) {
            try {

                await Imc.findByIdAndDelete(id)

                response.status(200).json({ message: 'Imc deletado' })
            } catch (error) {
                response.status(500).json({ error: error })
            }
        } else {
            return response.status(401).json({ message: "Você não possui este acesso" })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})