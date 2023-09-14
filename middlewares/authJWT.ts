import jwt from "jsonwebtoken";
import { User } from "../models/User"
import 'dotenv/config';

export async function verifyToken(req: string | undefined) {
    if (req && req.split(' ')[0] === 'JWT') {
        jwt.verify(req.split(' ')[1], `${process.env.API_SECRET ? process.env.API_SECRET : ""}`, function (err, decode) {
            if (decode != null)
                console.log((decode as jwt.JwtPayload).id)
        })
    }

}   
