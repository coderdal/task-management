const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// güvenlik kontrolü middleware
router.use(authenticate);

// tüm kullanıcılar
router.get('/', getAllUsers);

// id ile kullanıcı
router.get('/:id', getUserById);

// kullanıcı oluşturma
router.post('/', isAdmin, createUser);

// kullanıcı güncelleme
router.put('/:id', isAdmin, updateUser);

// kullanıcı silme
router.delete('/:id', isAdmin, deleteUser);

module.exports = router; 