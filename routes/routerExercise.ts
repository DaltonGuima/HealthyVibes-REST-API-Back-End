import { Router } from "express";
import { Exercise } from "../models/Exercise";
import { ExerciseInterface } from "../Interfaces/Exercise";
import { UserInterface } from "../Interfaces/User";
import { verifyToken } from "../middlewares/authJWT";

export const exerciseRouter = Router();

exerciseRouter.post("/", async (request, response) => {
    //req.body
    const exercise: ExerciseInterface = request.body;
    const token = await verifyToken(request.headers.authorization)

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                const saveExercise = await Exercise.create(exercise);

                return response.status(201).json({
                    savedID: saveExercise.id,
                    message: "Exercício inserido no sistema"
                });
            } catch (error) {
                return response.status(500).json({ error: error });
            }
        } else {
            return response.status(403).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(401).json({ message: "Token Inválido" })
    }
});

exerciseRouter.get("/", async (request, response) => {

    const token = await verifyToken(request.headers.authorization)

    if (token) {

        try {

            const exercises = await Exercise.find()
            return response.status(200).json(exercises)

        } catch (error) {
            return response.status(500).json({ error: error })
        }

    } else {
        return response.status(401).json({ message: "Token Inválido" })
    }
});

exerciseRouter.get("/:id", async (request, response) => {
    const id = request.params.id;
    const token = await verifyToken(request.headers.authorization)


    if (token) {
        try {
            const exercise = await Exercise.findById(id);

            if (!exercise) {
                return response
                    .status(422)
                    .json({ message: "O exercício não foi encontrado" });
            }
            return response.status(200).json(exercise);
        } catch (error) {
            return response.status(500).json({ error: error });
        }
    } else {
        return response.status(401).json({ message: "Token Inválido" })
    }
});

// Update - atualização de dados (PUT, PATch)

exerciseRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro
    const token = await verifyToken(request.headers.authorization)
    const exercise: ExerciseInterface = request.body;

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Exercise.findByIdAndUpdate(id, exercise);

                return response.status(200).json(exercise);
            } catch (error) {
                return response.status(500).json({ error: error });
            }
        } else {
            return response.status(403).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(401).json({ message: "Token Inválido" })
    }
});

exerciseRouter.delete("/:id", async (request, response) => {
    const id = request.params.id;
    const token = await verifyToken(request.headers.authorization)
    const exercise = await Exercise.findById(id);

    if (!exercise) {
        return response
            .status(422)
            .json({ message: "O exercício não foi encontrado" });
    }

    if (token) {
        if ((token as UserInterface).role == "admin") {
            try {
                await Exercise.findByIdAndDelete(id);

                return response.status(200).json({ message: "Exercício deletado" });
            } catch (error) {
                return response.status(500).json({ error: error });
            }
        } else {
            return response.status(403).json({ message: "Você não possui este acesso" })
        }
    } else {
        return response.status(401).json({ message: "Token Inválido" })
    }
});
