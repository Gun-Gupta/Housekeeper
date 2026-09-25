const express = require('express');
const router = express.Router();
const { registerclient, loginClient, getAllClients, updateClient, deleteClient, blockClient } = require('../controllers/ClientController');

router.post('/register', registerclient);
router.post('/login', loginClient);
router.get('/all', getAllClients);
router.put('/block/:id', blockClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;