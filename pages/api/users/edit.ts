import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import bcrypt from 'bcrypt';

export default async function handler( req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Metodo no permitido'})
    }

    const { id, username, password } = req.body;
    if (!id || !username) {
        return res.status(400).json({ message: 'ID Y Nuevo username requeridos' });
    }
    try {
        //Verificar si el usuario existe y esta activo
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND activo = "Y"', [id])
        const users = rows as Array<{ id: number; username: string; password: string }>

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        //Preparacion de datos para actualización
        let query = 'UPDATE users SET username = ?';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any[] = [username];

        if (password) {
         const hashedPassword = await bcrypt.hash(password, 10);
         query += ', password = ?';
         params.push(hashedPassword);
        }
        query += 'WHERE id = ?';
        params.push(id);
        
        await pool.query(query, params);

        return res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar el usuario: ', error);
        return res.status(500).json({ message: 'Error interno del servidor' })
    }

}