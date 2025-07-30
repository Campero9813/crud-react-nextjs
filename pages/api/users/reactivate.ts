import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

export default async function handle(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Metodo no permitido' });
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'ID Requerido' })
    }
    try {
        await pool.query('UPDATE users SET activo = "Y" WHERE id = ?', [id])
        return res.status(200).json({ message: 'Usuario Reactivado correctamente' })
    } catch (error) {
        console.error('Error al reactivar al usuario: ', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}