import { Router } from "express"
import { Recipe } from "../models/Recipe"
import { RecipeInterface } from "../Interfaces/Recipe"
import { verifyToken } from "../middlewares/authJWT"
import { UserInterface } from "../Interfaces/User";


export const recipeRouter = Router()

recipeRouter.post('/', async (request, response) => {
    //req.body
    const recipe: RecipeInterface = request.body

    const token = await verifyToken(request.headers.authorization)

    if (token) {

        try {


            if ((token as UserInterface).role == "normal") {
                if (recipe.user == null || recipe.user == (token as UserInterface).id)
                    recipe.user = (token as UserInterface).id
                else
                    return response.status(401).json({ message: "Você não pode inserir receita, de outro usuário" })
            }

            const savedRecipe = await Recipe.create(recipe)

            return response.status(201).json({
                savedID: savedRecipe.id,
                message: 'Receita inserida no sistema'
            })

        } catch (error) {
            return response.status(500).json({ error: error })

        }
    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

recipeRouter.get('/', async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {

                const recipes = await Recipe.find()

                return response.status(200).json(recipes)

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

recipeRouter.get('/recipesWIthNoUser', async (request, response) => {


    try {

        const recipes = await Recipe.find({ user: null }).populate('image')

        return response.status(200).json(recipes)

    } catch (error) {
        return response.status(500).json({ error: error })
    }


})


recipeRouter.get('/:id', async (request, response) => {
    const id = request.params.id

    const token = await verifyToken(request.headers.authorization)

    if (token) {
        try {
            const recipe = await Recipe.findById(id).populate('image')

            if (!recipe) {
                return response.status(422).json({ message: 'A receita não foi encontrada' })

            }

            if ((recipe.user || "").toString() == (token as UserInterface).id || (token as UserInterface).role == "admin")
                return response.status(200).json(recipe)
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

recipeRouter.get('/recipesWithUser/:idUser', async (request, response) => {
    const idUser = request.params.idUser

    const token = await verifyToken(request.headers.authorization)


    if (token) {
        try {
            const recipes = await Recipe.find({user : idUser})

    

            if (!recipes) {
                return response.status(422).json({ message: 'Não foram encontradas receitas' })
            }

            if (idUser == (token as UserInterface).id || (token as UserInterface).role == "admin")
                return response.status(200).json(recipes)
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

recipeRouter.patch('/:id', async (request, response) => {
    const id = request.params.id // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const recipe: RecipeInterface = request.body
    const recipeUserId = await Recipe.findById(id).select({ user: 1 })

    if (token) {
        if ((
            recipeUserId?.user == null ||
            (recipe.user && (recipeUserId?.user != recipe.user))
        )
            && (token as UserInterface).role == "normal"
        )
            return response.status(401).json({ message: "Você não possui este acesso" })


        try {

            await Recipe.findByIdAndUpdate(id, recipe)


            return response.status(200).json(recipe)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(403).json({ message: "Token Inválido" })
    }
})

recipeRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const token = await verifyToken(request.headers.authorization)
    const recipe = await Recipe.findById(id)

    if (!recipe) {
        return response.status(422).json({ message: 'A receita não foi encontrada' })
    }

    if (token) {

        

        if (recipe.user == (token as UserInterface).id || (token as UserInterface).role == "admin") {
            try {

                await Recipe.findByIdAndDelete(id)

                return response.status(200).json({ message: 'Receita deletada' })
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
