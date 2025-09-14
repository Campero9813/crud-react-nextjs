import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import bcrypt from 'bcrypt';
//importamos JWT para autenticacion
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const users = rows as Array<{ id: number; username: string; password: string }>;

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];  //Obtener primer usuario
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'clave-secreta', //Colocar clave secreta
      { expiresIn: '1h' }
    )

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true, //Seguridad
        secure: process.env.NODE_ENV === "production", //Solo http en prod
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, //1 hora
      })
    );

    return res.status(200).json({ message: 'Login exitoso', user: { id: user.id, username: user.username } });

  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
