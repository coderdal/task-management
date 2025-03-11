const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { authenticate, isTaskOwnerOrAdmin } = require('../middleware/auth.middleware');

// güvenlik kontrolü middleware
router.use(authenticate);

// tüm görevler
router.get('/', getAllTasks);

// id ile göre görev
router.get('/:id', getTaskById);

// görev oluşturma
router.post('/', createTask);

// görev güncelleme
router.put('/:id', isTaskOwnerOrAdmin, updateTask);

// görev silme
router.delete('/:id', isTaskOwnerOrAdmin, deleteTask);

module.exports = router; 