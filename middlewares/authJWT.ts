import jwt from "jsonwebtoken";
import { User } from "../models/User";
import "dotenv/config";
import { UserInterface } from "../Interfaces/User";
import { verify } from 'jsonwebtoken';

export async function verifyToken(req: string | undefined) : Promise<UserInterface | undefined | string> {
    let user 
    if (req && req.split(" ")[0] === "JWT") {
        await verify(
            req.split(" ")[1],
            process.env.API_SECRET || "" ,
            async function (err, decode) {
                user = await User.findById(
                    (decode as jwt.JwtPayload).id
                )                
            }
        );
        if (user)
            return user as UserInterface

    } else {
        return "Token Inválido";
    }

}
