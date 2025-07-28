import mysql from 'mysql2/promise';

//Configurar la conexion a la base

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root', 
    database: 'crud_nextjs',
});

export default pool;