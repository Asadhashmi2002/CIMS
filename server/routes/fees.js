const express = require('express');
const router = express.Router();

// Sample data (empty for now)
const fees = [];

// Get all fees
router.get('/', (req, res) => {
  res.json(fees);
});

// Get a single fee record
router.get('/:id', (req, res) => {
  const fee = fees.find(f => f.id === req.params.id);
  if (fee) {
    res.json(fee);
  } else {
    res.status(404).json({ message: 'Fee record not found' });
  }
});

// Create a new fee record
router.post('/', (req, res) => {
  const newFee = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    status: req.body.status || 'pending'
  };
  fees.push(newFee);
  res.status(201).json(newFee);
});

// Update a fee record
router.put('/:id', (req, res) => {
  const index = fees.findIndex(f => f.id === req.params.id);
  if (index !== -1) {
    fees[index] = { 
      ...fees[index], 
      ...req.body,
      updatedAt: new Date().toISOString() 
    };
    res.json(fees[index]);
  } else {
    res.status(404).json({ message: 'Fee record not found' });
  }
});

// Delete a fee record
router.delete('/:id', (req, res) => {
  const index = fees.findIndex(f => f.id === req.params.id);
  if (index !== -1) {
    const deletedFee = fees.splice(index, 1)[0];
    res.json(deletedFee);
  } else {
    res.status(404).json({ message: 'Fee record not found' });
  }
});

module.exports = router; 