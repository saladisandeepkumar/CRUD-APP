const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

let students = [];

app.use(cors());
app.use(bodyParser.json());

app.post('/students', (req, res) => {
  const student = req.body;
  students.push(student);
  res.status(201).send('Student added');
});

app.get('/students', (req, res) => {
  res.json(students);
});

app.put('/students/:id', (req, res) => {
  const id = req.params.id;
  students = students.map(std => std.id === id ? req.body : std);
  res.send('Student updated');
});

app.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  students = students.filter(std => std.id !== id);
  res.send('Student deleted');
});

app.listen(PORT, () => console.log(`Student CRUD Server running on http://localhost:${PORT}`));