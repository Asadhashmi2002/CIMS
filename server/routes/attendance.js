const express = require('express');
const router = express.Router();

// Sample data (empty for now)
const attendance = [];

// Get all attendance records
router.get('/', (req, res) => {
  res.json(attendance);
});

// Get a single attendance record
router.get('/:id', (req, res) => {
  const record = attendance.find(a => a.id === req.params.id);
  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ message: 'Attendance record not found' });
  }
});

// Create a new attendance record
router.post('/', (req, res) => {
  const newRecord = {
    id: Date.now().toString(),
    ...req.body,
    date: req.body.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  attendance.push(newRecord);
  res.status(201).json(newRecord);
});

// Update an attendance record
router.put('/:id', (req, res) => {
  const index = attendance.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    attendance[index] = { 
      ...attendance[index], 
      ...req.body,
      updatedAt: new Date().toISOString() 
    };
    res.json(attendance[index]);
  } else {
    res.status(404).json({ message: 'Attendance record not found' });
  }
});

// Delete an attendance record
router.delete('/:id', (req, res) => {
  const index = attendance.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    const deletedRecord = attendance.splice(index, 1)[0];
    res.json(deletedRecord);
  } else {
    res.status(404).json({ message: 'Attendance record not found' });
  }
});

module.exports = router; 