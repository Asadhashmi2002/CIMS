const express = require('express');
const router = express.Router();

// Sample data (empty for now)
const batches = [];

// Get all batches
router.get('/', (req, res) => {
  res.json(batches);
});

// Get batches for a specific teacher
router.get('/teacher/:teacherId', (req, res) => {
  const teacherBatches = batches.filter(batch => 
    batch.teacherIds && batch.teacherIds.includes(req.params.teacherId)
  );
  res.json(teacherBatches);
});

// Get a single batch
router.get('/:id', (req, res) => {
  const batch = batches.find(b => b.id === req.params.id);
  if (batch) {
    res.json(batch);
  } else {
    res.status(404).json({ message: 'Batch not found' });
  }
});

// Create a new batch
router.post('/', (req, res) => {
  const newBatch = {
    id: Date.now().toString(),
    ...req.body,
    teacherIds: req.body.teacherIds || [],
    createdAt: new Date().toISOString()
  };
  batches.push(newBatch);
  res.status(201).json(newBatch);
});

// Update a batch
router.put('/:id', (req, res) => {
  const index = batches.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    batches[index] = { 
      ...batches[index], 
      ...req.body,
      updatedAt: new Date().toISOString() 
    };
    res.json(batches[index]);
  } else {
    res.status(404).json({ message: 'Batch not found' });
  }
});

// Delete a batch
router.delete('/:id', (req, res) => {
  const index = batches.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    const deletedBatch = batches.splice(index, 1)[0];
    res.json(deletedBatch);
  } else {
    res.status(404).json({ message: 'Batch not found' });
  }
});

// Assign teacher to batch
router.post('/:batchId/assign-teacher', (req, res) => {
  const { teacherId } = req.body;
  const batch = batches.find(b => b.id === req.params.batchId);
  
  if (!batch) {
    return res.status(404).json({ message: 'Batch not found' });
  }
  
  if (!batch.teacherIds) {
    batch.teacherIds = [];
  }
  
  if (!batch.teacherIds.includes(teacherId)) {
    batch.teacherIds.push(teacherId);
  }
  
  res.json(batch);
});

module.exports = router; 