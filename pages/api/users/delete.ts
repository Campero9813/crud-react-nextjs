import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handler( req: NextApiRequest, res: NextApiResponse){
    if(req.method !== 'POST'){
        return res.status(405).json({ message: 'Metodo no Permitido'})
    }

    const { id } = req.body;
    
    if (!id) {
        return res.status(400).json({ message: 'ID Requerido' });
    }

    try {
        await pool.query('UPDATE users SET activo = "N" WHERE id = ?', [id]);
        return res.status(200).json({ message: 'Usuario Desactivado' });
    } catch (error) {
        console.error('Error al desactivar el usuario', error);
        return res.status(500).json({ mesasge: 'Error interno del servidor' });
    }
}