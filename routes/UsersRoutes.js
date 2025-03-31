const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Autos = require('../models/Auto');   

router.get('/usuarios', async (req, res) => { 
    try {
        // Realiza la consulta a la base de datos
        const result = await pool.query('SELECT * FROM usuarios');       
        // Accede a la propiedad `rows` para obtener los datos
        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

router.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el id de los parámetros de la URL

    try {
        // Realiza la consulta a la base de datos para obtener el usuario por id
        const result = await pool.query('SELECT * FROM usuarios WHERE idusuario = $1', [id]);

        // Verifica si se encontró el usuario
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Envía el usuario encontrado como respuesta
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el usuario por id:', error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

router.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el id de los parámetros de la URL
    const { correo, contrasenia,fecharegistro, idtipo } = req.body; // Obtiene los datos del cuerpo de la solicitud

    // Validación de los datos enviados
    if (!correo || !contrasenia || !fecharegistro || !idtipo) { 
        return res.status(400).json({ message: 'Faltan datos requeridos: nombre, email o telefono' });
    }

    try {
        const hashedPassword = await bcrypt.hash(contrasenia, 10);

        // Realiza la consulta para actualizar el usuario
        const result = await pool.query(
            'UPDATE usuarios SET correo = $1, contrasenia = $2, fecharegistro = $3, idtipo = $4 WHERE idusuario = $5 RETURNING *',
            [correo, hashedPassword, fecharegistro, idtipo, id]
        );

        // Verifica si se actualizó algún registro
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Envía el usuario actualizado como respuesta
        res.status(200).json({ message: 'Usuario actualizado', usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

router.post('/usuarios', async (req, res) => {
    const { correo, contrasenia, fecharegistro, idtipo } = req.body; // Obtiene los datos del cuerpo de la solicitud

    // Validación de los datos enviados
    if (!correo || !contrasenia || !fecharegistro || !idtipo) {
        return res.status(400).json({ message: 'Faltan datos requeridos: correo, contrasenia, fecharegistro o idtipo' });
    }

    try {
        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10);

        // Realiza la consulta para insertar el usuario
        const result = await pool.query(
            'INSERT INTO usuarios (correo, contrasenia, fecharegistro, idtipo) VALUES ($1, $2, $3, $4) RETURNING *',
            [correo, hashedPassword, fecharegistro, idtipo]
        );

        // Envía el usuario insertado como respuesta
        res.status(201).json({ message: 'Usuario creado', usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
});

router.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el id de los parámetros de la URL

    try {
        // Realiza la consulta para eliminar el usuario
        const result = await pool.query('DELETE FROM usuarios WHERE idusuario = $1 RETURNING *', [id]);

        // Verifica si se eliminó algún registro
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Envía una respuesta indicando que el usuario fue eliminado
        res.status(200).json({ message: 'Usuario eliminado', usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});

module.exports = router;