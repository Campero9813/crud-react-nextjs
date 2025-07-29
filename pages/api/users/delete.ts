import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler( req: NextApiRequest, res: NextApiResponse){
    if(req.method !== 'POST'){
        return res.status(405).json({ message: 'Metodo no Permitido'})
    }
}