import { Router } from "express"
import { Consumption } from "../models/Consumption"
import { ConsumptionInterface } from "../Interfaces/Consumption"
import { verifyToken } from "../middlewares/authJWT";
import { UserInterface } from "../Interfaces/User";


export const consumptionRouter = Router()

consumptionRouter.post('/', async (request, response) => {
    const token = await verifyToken(request.headers.authorization)
    const consumption: ConsumptionInterface = request.body

    if (token) {
        try {

            if (consumption.user == null) {
                consumption.user = (token as UserInterface).id
            }

            if ((token as UserInterface).role == "normal" && consumption.user != (token as UserInterface).id)
                return response.status(401).json({ message: "Você não pode inserir consummo, de outro usuário" })

            const savedConsumption = await Consumption.create(consumption)
            return response.status(201).json({
                saveID: savedConsumption.id,
                message: 'Valor de consumo inserido no sistema'
            })

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token inválido" })
    }
})

consumptionRouter.get('/', async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {

                const consumptions = await Consumption.find()
                return response.status(200).json(consumptions)

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

consumptionRouter.get('/myConsumptions', async (request, response) => {

    const token = await verifyToken(request.headers.authorization)


    if (token) {

        try {

            const consumptions = await Consumption.find({ user: (token as UserInterface).id })
            return response.status(200).json(consumptions)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

consumptionRouter.get('/myConsumptions/water', async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {

        try {

            const consumptions = await Consumption.find({ user: (token as UserInterface).id, tipoConsumo: "Água" })
            return response.status(200).json(consumptions)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})
consumptionRouter.get('/myConsumptions/cal', async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {

        try {

            const consumptions = await Consumption.find({ user: (token as UserInterface).id, tipoConsumo: "Calorias" })
            return response.status(200).json(consumptions)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

consumptionRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)

    if (token) {

        try {
            const consumption = await Consumption.findById(id)

            if (!consumption) {
                return response.status(422).json({ message: 'Valores de consumo não foram encontrados' })

            }
            if (consumption.user == (token as UserInterface).id || (token as UserInterface).role == "admin")
                return response.status(200).json(consumption)
            else
                return response.status(401).json({ message: "Você não possui este acesso" })

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    }
    else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

// Update - atualização de dados (PUT, PATch)

consumptionRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro    
    const consumption: ConsumptionInterface = request.body
    const token = await verifyToken(request.headers.authorization)
    const consumptionUserId = await Consumption.findById(id).select({ user: 1 })

    if (token) {
        if (
            (consumption.user && (consumptionUserId?.user != consumption.user))
            && (token as UserInterface).role == "normal"
        )
            return response.status(401).json({ message: "Você não possui este acesso" })

        try {

            await Consumption.findByIdAndUpdate(id, consumption)


            return response.status(200).json(consumption)


        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

consumptionRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const consumption = await Consumption.findById(id)
    const token = await verifyToken(request.headers.authorization)

    if (!consumption) {
        return response.status(422).json({ message: 'Este valor de consumo não foi encontrado' })
    }

    if (token) {
        if ((token as UserInterface).role == "admin" || (token as UserInterface).id == consumption.user) {
            try {

                await Consumption.findByIdAndDelete(id)

                return response.status(200).json({ message: 'Valor de consumo deletado' })
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

consumptionRouter.get('/addIot/:value', async (request, response) => {
    const value = request.params.value
    // const verify = await Consumption.find({ createdAt: Date.now() })

    try {
        if (Number(value) == 0) {
            const timeNow = new Date(Date.now())
            const consumption: ConsumptionInterface = {
                quantidade: 200,
                tipoConsumo: "Água",
                user: "6561376e0a1894fe0bce5687",
                belongDate: timeNow
            }

            const savedConsumption = await Consumption.create(consumption)
            return response.status(201).json({
                saveID: savedConsumption.id,
                message: 'Valor de consumo inserido no sistema'
            })

        }
        else {
            return response.status(403).json({ message: "Somente garrafa vazia" })
        }

    } catch (error) {
        return response.status(500).json({ error: error })
    }

})
