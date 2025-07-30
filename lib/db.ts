import mysql from 'mysql2/promise';

//Configurar la conexion a la base

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'crud_nextjs',
});

export default pool;