import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { DB_USER, url } from "./utils/UserMongoDb";
import axios from "axios";
import { userRouter } from "./routes/routerUser";
import { recipeRouter } from "./routes/routerRecipe";
import { exerciseRouter } from "./routes/routerExercise";
import { consumptionRouter } from "./routes/routerConsumption";
import { dietRouter } from "./routes/routerDiet";
import { imcRouter } from "./routes/routerImc";

const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

app.use(cors());

// Rotas
app.use('/users', userRouter)
app.use('/recipes', recipeRouter)
app.use('/exercises', exerciseRouter)
app.use('/diets', dietRouter)
app.use('/consumptions', consumptionRouter)
app.use('/imcs', imcRouter)


const port = 3333;

mongoose
    .connect(
        url, { dbName: "HealthyVibesBD" }
    )
    .then(() => {
        app.listen(port, () => {
            console.log("\nConectado com sucesso no Mongo com usuário: ", DB_USER +
                "! \nEscutando na porta:", port);
        });
    })
    .catch(err => console.log("PUTZ GRILA!!!\n", err));

axios.get("https://api.ipify.org?format=json").then(response => {
    console.log("\nseu ip é =", response.data);
});



