const express = require('express');
const router = express.Router();
const {
  registerWorker, loginWorker,
  getAllWorkers, getWorkerById,
  updateWorker, deleteWorker, blockWorker
} = require('../controllers/WorkerController');

router.post('/register', registerWorker);
router.post('/login', loginWorker);
router.get('/all', getAllWorkers);
router.put('/block/:id', blockWorker);
router.get('/:id', getWorkerById);
router.put('/:id', updateWorker);
router.delete('/:id', deleteWorker);

module.exports = router;