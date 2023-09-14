// import { RecipeInterface } from "./Recipe";
import { ExerciseInterface } from "./Exercise";
import { ImcInterface } from "./Imc";
import { DietInterface } from "./Diet";
import { ConsumptionInterface } from "./Consumption";

export interface UserInterface {
    nome: string,
    email: string,
    senha: string,
    // recipes: [RecipeInterface],
    role: string,
    exercises: [ExerciseInterface],
    imcs: [ImcInterface],
    diets: [DietInterface],
    consumption: [ConsumptionInterface]
}