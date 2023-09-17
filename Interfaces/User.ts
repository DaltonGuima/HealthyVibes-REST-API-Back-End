// import { RecipeInterface } from "./Recipe";
import { ExerciseInterface } from "./Exercise";
import { DietInterface } from "./Diet";
import { ConsumptionInterface } from "./Consumption";

export interface UserInterface {
    id: string,
    nom: string,
    email: string,
    senha: string,
    // recipes: [RecipeInterface],
    role: string,
    exercises: [ExerciseInterface],
    // imcs: [ImcInterface],
    diets: [DietInterface],
    consumption: [ConsumptionInterface]
}