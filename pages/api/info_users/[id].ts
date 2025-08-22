import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    
    if (!id || Array.isArray(id)) {
        return res.status(400).json({message: "ID Invalido o desconocido"});
    }

    //POST Para agregar perfiles
    if (req.method === "POST") {
        try {
            const {user_id, nombre, telefono, correo, imagen_perfil} = req.body;
            if(!user_id) return res.status(400).json({message: "User_id es requerido"});
            
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO info_users (user_id, nombre, telefono, correo, imagen_perfil, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ? NOW(), NOW())`,
                 [user_id, nombre ?? '', telefono ?? '', correo ?? '', imagen_perfil ?? '']
            );
            return res.status(202).json({message: "Perfil ingresa con exito", id: result.insertId})
        } catch (error) {
            console.error("Error al guardar los datos", error);
            return res.status(500).json({message: "Error interno del servidor"})
        }
        
    }

    //GET Para registro especifico
    if(req.method === "GET"){
        try {
            const [rows] = await pool.query<RowDataPacket[]>(
                `SELECT iu.*, u.username
                FROM info_users iu
                INNER JOIN users u ON u.id = iu.user_id
                WHERE iu.user_id = ?`,
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({message: "Informacion no econtrada"});
            }
            return res.status(200).json([rows[0]])
        } catch (error) {
            console.error("Error al obtener info_user", error) ;
            return res.status(500).json({message: "Error interno del servidor"});
        }
    }
    
    //PUT Actualizar 
    if (req.method === "PUT") {
        try {
            const { nombre, telefono, correo, imagen_perfil } = req.body as {
                nombre?: string;
                telefono?: string;
                correo?: string;
                imagen_perfil?: string,
            };

            //Actualizar con update_at
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE info_users
                SET nombre = ?, telefono = ?, correo = ?, imagen_perfil = ?, updated_at = NOW()
                WHERE id = ?`,
                [nombre ?? null, telefono ?? null, correo ?? null, imagen_perfil ?? null, id]
            );

            if(result.affectedRows === 0){
                return res.status(404).json({message: "No se encontro el registro para actualizar"});
            }
            return res.status(200).json({message: "Información actualizada"});
        } catch (error) {
            console.error("Error al actualizar info_user: ", error);
            return res.status(500).json({message: "Error interno del servidor"})
        }
    }
    //Delete (OPCIONAL)
    if( req.method === "DELETE"){
        try {
            const [result] = await pool.query<ResultSetHeader>(
                `DELETE FROM info_users WHERE id = ? `,
                [id]
            );

            if(result.affectedRows === 0){
                return res.status(404).json({message: "No se encontró el registro para eliminar"})
            }
            return res.status(200).json({message: "No se econtró el registro para eliminar"});
        } catch (error) {
            console.error("Error al eliminar info_user: ", error);
            return res.status(500).json({message: "Error interno del servidor"});
        }
    }

    return res.status(405).json({message: "Metodo no permitido"});
}