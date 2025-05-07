const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser, searchUser } = require('../controllers/user.controller');

router.get('/', getAllUsers);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.get("/search", searchUser);

module.exports = router;