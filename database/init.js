import mysql from 'mysql2/promise';

export async function conecctarDB() {
  try {
    const conexion = await mysql.createConnection({
      host: 'localhost',
      user: 'campus2023',
      password: 'campus2023',
      database: 'fittrack_db'
    });
    console.log('Conexion exitosa');
    return conexion;
  } catch (error) {
    console.error('Error alconectar con mysql:',error.message);
    throw error; 
  }
}