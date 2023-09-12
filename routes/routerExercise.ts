import { Router } from "express";
import { Exercise } from "../models/Exercise";
import { ExerciseInterface } from "../Interfaces/Exercise";

export const exerciseRouter = Router();

exerciseRouter.post("/", async (request, response) => {
    //req.body
    const exercise: ExerciseInterface = request.body;

    try {
        const saveExercise = await Exercise.create(exercise);

        return response.status(201).json({
            savedID: saveExercise.id,
            message: "Exercício inserido no sistema"
        });
    } catch (error) {
        return response.status(500).json({ error: error });
    }
});

exerciseRouter.get("/", async (request, response) => {
    try {
        const exercise = await Exercise.find();

        return response.status(200).json(exercise);
    } catch (error) {
        return response.status(500).json({ error: error });
    }
});

exerciseRouter.get("/:id", async (request, response) => {
    const id = request.params.id;

    try {
        // findONe({ _id: id})
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
});

// Update - atualização de dados (PUT, PATch)

exerciseRouter.patch("/:id", async (request, response) => {
    const id = request.params.id; // se alterar em cima altera o parâmetro

    const exercise: ExerciseInterface = request.body;

    try {
        await Exercise.findByIdAndUpdate(id, exercise);

        return response.status(200).json(exercise);
    } catch (error) {
        return response.status(500).json({ error: error });
    }
});

exerciseRouter.delete("/:id", async (request, response) => {
    const id = request.params.id;

    const exercise = await Exercise.findById(id);

    if (!exercise) {
        return response
            .status(422)
            .json({ message: "O exercício não foi encontrado" });
    }

    try {
        await Exercise.findByIdAndDelete(id);

        return response.status(200).json({ message: "Exercício deletado" });
    } catch (error) {
        return response.status(500).json({ error: error });
    }
});
