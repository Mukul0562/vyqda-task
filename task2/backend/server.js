const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'notes_app', 
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the MySQL database.');
  }
});


app.get('/notes', (req, res) => {
  const sql = 'SELECT * FROM notes';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});


app.post('/notes', (req, res) => {
  const { title, paragraph, timestamp } = req.body;
  const sql = 'INSERT INTO notes (title, paragraph, timestamp) VALUES (?, ?, ?)';
  db.query(sql, [title, paragraph, timestamp], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, title, paragraph, timestamp });
  });
});


app.delete('/notes/:id', (req, res) => {
  const sql = 'DELETE FROM notes WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Note deleted' });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
