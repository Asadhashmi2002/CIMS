const express = require('express');
const router = express.Router();

// Sample data (empty for now)
const students = [];

// Get all students
router.get('/', (req, res) => {
  res.json(students);
});

// Get a single student
router.get('/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// Create a new student
router.post('/', (req, res) => {
  const newStudent = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Update a student
router.put('/:id', (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    students[index] = { 
      ...students[index], 
      ...req.body,
      updatedAt: new Date().toISOString() 
    };
    res.json(students[index]);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// Delete a student
router.delete('/:id', (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    const deletedStudent = students.splice(index, 1)[0];
    res.json(deletedStudent);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

module.exports = router; 