const mysql = require('mysql2/promise');
const menu = require('./menu');

async function iniciar() {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'campus2023',
            password: 'campus2023',
            database: 'fittrack_db'
        });

        const conexion = await pool.getConnection();
        console.log('');
        conexion.release();
        await menu.iniciarMenu(pool);
        await pool.end();
        console.log('Conexión cerrada');
    } catch (error) {
        console.error(
            'Error al conectar con la base de datos:',
            error.message
        );
    }
}

iniciar();
