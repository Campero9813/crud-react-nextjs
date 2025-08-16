import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Metodo no permitido' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    try {
        //Verificacion de usuario existente
        const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((rows as any[]).length > 0 ) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        //Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        //Guardar registro en la BD
        await pool.query('INSERT INTO users (username, password) VALUES (?,?)', [
            username,
            hashedPassword,
        ]);
        return res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error){
        console.error('Error al registrar usuario: ', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}