import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";


type InfoUserRow = {
    id: number;
    user_id: number;
    username: string;
    nombre: string;
    telefono: string | null;
    correo: string | null;
    imagen_perfil: string | null;
    created_at: string;
}

export default async function handler( req: NextApiRequest, res: NextApiResponse){
    //Get lista de informacion de usuario (filtrar por user_id)
    if(req.method === "GET"){
        try {
            const {user_id} = req.body;
            let sql = `
                SELECT iu.id, iu.user_id, u.username, iu.nombre, iu.telefono, iu.correo, iu.imagen_perfil, iu.created_at, iu.updated_at
                FROM info_users iu
                INNER JOIN users u ON u.id = iu.user_id
            `;
            const params: unknown[] = [];
            if (user_id) {
                sql += `WHERE iu.user_id = ?`;
                params.push(parseInt(String(user_id), 10 ))
            }
            const [rows] = await pool.query<RowDataPacket[]>(sql, params);
            return res.status(200).json(rows as InfoUserRow[]);
        } catch(error) {
            console.error("Error al obtener info users: ", error);
            return res.status(500).json({message: "Error interno del servidort"});
        }
    }
    //POST Ficha Info para usuario
    if (req.method === "POST") {
        try {
            const { user_id, nombre, telefono, correo, imagen_perfil } = req.body as {
                user_id?: number;
                nombre?: string;
                telefono?: string;
                correo?: string;
                imagen_perfil?: string;
            }
            if (!user_id || !nombre) {
                return res.status(400).json({message: "El usuario o el nombre son requeridos"});
            }

            //Validamos que exista el usuario
            const [userRows] = await pool.query<RowDataPacket[]>(
                "SELECT id FROM users WHERE id = ?",
                [user_id]
            );
            if (userRows.length === 0) {
                return res.status(404).json({message: "El usuario no existe"});
            }
            //(Opcional) Verificar que no exista ficha previa para el user_id
            const [existsRows] = await pool.query<RowDataPacket[]>(
                "SELECT id FROM info_users WHERE user_id = ?",
                [user_id]
            ) 
            if (existsRows.length > 0) {
                return res.status(409).json({message: "Este usuario ya tiene informacion guardada"});
            }

            //Insertar Ficha
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO info_users (user_id, nombre, telefono, correo, imagen_perfil)
                VALUES (?, ?, ?, ?, ?)`,
                [user_id, nombre, telefono ?? null, correo ?? null, imagen_perfil ?? null]
            );

            return res.status(201).json({message: "Informacion creada", id: result.insertId});
        } catch (error) {
            console.error("Error al crear info_user: ", error);
            return res.status(500).json({message: "Error interno del servidor"});
        }    
    }

    return res.status(405).json({message: "Metodo no permitido"});
}