const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Autos = require('../models/Auto');   

router.post('/login', async (req, res) => {

    try {
        const { correo, contrasenia } = req.body;

        // Validar entrada
        if (!correo || !contrasenia) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
        }

        // Verificar que JWT_SECRET esté definido
        if (!process.env.JWT_SECRET) {
            console.error('Error: JWT_SECRET no está definido en las variables de entorno');
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        // Buscar al usuario por el correo
        const result = await pool.query('SELECT * FROM Usuarios WHERE Correo = $1', [correo]);
        const user = result.rows[0];
       

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la de la base de datos
        const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: user.IdUsuario, rol: user.idtipo },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Si el usuario es un administrador (IdTipo = 1)
        if (user.idtipo === 1) {
            const clientes = await pool.query('SELECT * FROM clientes ');
            return res.json({ token, rol: user.idtipo, clientes: clientes.rows });
        }
        // Si el usuario es un administrador (IdTipo = 2)
        if (user.idtipo === 2) {
            try {
                console.log('Modelo Auto:', Autos); // Verifica si el modelo está definido
                const autosDisponibles = await Autos.find(); // Consulta a MongoDB
                console.log('Autos disponibles:', autosDisponibles); // Verifica los resultados
                return res.json({ token, rol: user.idtipo, Autos: autosDisponibles });
            } catch (error) {
                console.error('Error al obtener los autos desde MongoDB:', error);
                return res.status(500).json({ message: 'Error al obtener los autos' });
            }
        }

        return res.status(400).json({ message: 'Rol no reconocido' });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;