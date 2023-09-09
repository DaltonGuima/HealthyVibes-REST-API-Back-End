import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { DB_USER, url } from "./utils/UserMongoDb";
import axios from "axios";
import { userRouter } from "./routes/routerUser";


const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

app.use(cors());

// Rotas
app.use('/user', userRouter)

// !!!Rota Teste
app.get("/", (_req, res) => {
    res.json({ message: "Respondido!!" });
});


const port = 3333;


mongoose
    .connect(
        url
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



