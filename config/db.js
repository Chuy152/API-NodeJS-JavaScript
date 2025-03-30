const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config(); // Configuración de dotenv

// Configuración de PostgreSQL
const pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

// Probar conexión a PostgreSQL
const testPostgresConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Conexión exitosa a PostgreSQL');
        client.release();
    } catch (error) {
        console.error('Error al conectar a PostgreSQL:', error);
        process.exit(1);
    }
};

// Llama a la función para probar la conexión
testPostgresConnection();

// Conexión a MongoDB
const ConectarMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

// Probar conexión a MongoDB
const probarConexionMongo = async () => {
    try {
        await ConectarMongoDB(); // Llama al método para conectar a MongoDB
        console.log('Conexión a MongoDB exitosa');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
};

probarConexionMongo(); // Llama a la función para probar la conexión

module.exports = { pool, ConectarMongoDB };
