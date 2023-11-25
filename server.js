const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'peliculas',
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Rutas para el inicio de sesión y el registro

app.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    const query = `SELECT * FROM users WHERE (email = ? OR name = ?) AND password = ?`;
  
    db.query(query, [identifier, identifier, password], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error en el servidor al procesar la solicitud');
      } else {
        if (result.length > 0) {
          res.status(200).send('Inicio de sesión exitoso');
        } else {
          res.status(401).send('Credenciales incorrectas');
        }
      }
    });
  });

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send('Usuario registrado exitosamente');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
