import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try{
            /* const [rows] = await pool.query('SELECT id, username, created_at FROM users WHERE activo = "Y"'); */
            const [rows] = await pool.query('SELECT id, username, created_at, activo FROM users');
            return res.status(200).json(rows)
        }catch (error){
            console.error('Error al obtener usuarios: ', error);
            return res.status(500).json({ message: 'Error Interno' })
        }
    }
    if (req.method === 'POST') {
        const { username, password, activo } = req.body as {
            username?: string;
            password?: string;
            activo?: 'Y' | 'N';
        };
        
        if (!username || !password){
            return res.status(400).json({ message: 'Usuario y contraseña Requeridos' });
        }

        const status = activo === 'N' ? 'N' : 'Y';

        try{
            const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((rows as any[]).length > 0) {
                return res.status(409).json({ message: 'El usuario ya existe' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query('INSERT INTO users (username, password, activo) VALUES (?,?, ?)', [username, hashedPassword, status]);
            return res.status(201).json({ message: 'Usuario Creado' });
        } catch (error){
            console.error('Error al crear el usuario', error)
            return res.status(500).json({ message: 'Error interno' });
        }
    }
    return res.status(405).json({ message: 'Metodo no permitido' });
    
}