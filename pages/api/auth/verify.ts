import type { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method != 'GET') {
        return res.status(405).json({ message: 'Metodo no permitido'})
    }

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'No token found'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave-secreta')
        return res.status(200).json({message: 'Token Valido', token, user: decoded})
    } catch (error) {
        return res.status(401).json({message: 'Token invalido'})
    }
}