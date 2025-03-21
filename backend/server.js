const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { log } = require('console');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get('/users', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.status(200).send(users.rows);
    } catch (err) {
        res.status(400).send('Error al consultar los usuarios: ' + err.message);
    }
    finally{
        log('Consultando usuarios');
    }
});

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try{
        if (!name || !email) return res.status(400).send('name o email invalidos');
        const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (result.rows.length > 0) return res.status(400).send('El email ya esta registrado');
        await pool.query('INSERT INTO Users (name, email) VALUES ($1, $2)', [name, email]);
        res.status(201).send('Usuario creado con exito');
    }
    catch (err) {
        res.status(400).send('Error al crear el usuario: ' + err.message);
    }
    finally{
        log('Creando usuario');
    }
});

app.post('/update_user', async (req, res) => {
    const { name, id} = req.body;
    try{
        const result = await pool.query('SELECT * FROM Users WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(400).send('El usuario no existe');
        await pool.query('UPDATE Users SET name = $1 WHERE id = $2', [name, id]);
        res.status(200).send('Usuario actualizado con exito');
    }
    catch (err) {
        res.status(400).send('Error al actualizar el usuario: ' + err.message);
    }
    finally{
        log('Actualizando usuario');
    }
});

app.get('/delete_user/:id', async (req, res) => {
    if (!req.params) return res.status(400).send('Petición incorrecta');
    const { id } = req.params;
    try{
        const result = await pool.query('SELECT * FROM Users WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(400).send('El usuario no existe');
        await pool.query('DELETE FROM Users WHERE id = $1', [id]);
        res.status(200).send('Usuario eliminado con exito');
    }
    catch (err) {
        res.status(400).send('Error al eliminar el usuario: ' + err.message);
    }
    finally{
        log('Borrando usuario');
    }
});

app.get('/users/:id', async (req, res) => {
    if (!req.params) return res.status(400).send('Petición incorrecta');
    const { id } = req.params;
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) return res.status(400).send('El usuario no existe');
        res.status(200).send(user.rows);
    } catch (err) {
        res.status(400).send('Error al consultar el usuario: ' + err.message);
    }
    finally{
        log('Consultando usuario por id');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

