const { Task, User } = require('../models');
const { Op } = require('sequelize');

const getAllTasks = async (req, res) => {
  try {
    const { status, assignedTo } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (assignedTo) {
      whereClause.assignedTo = assignedTo;
    }
    
    if (userRole !== 'admin') {
      whereClause[Op.or] = [
        { assignedTo: userId },
        { createdBy: userId }
      ];
    }
    
    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const whereClause = { id };
    
    if (userRole !== 'admin') {
      whereClause[Op.or] = [
        { assignedTo: userId },
        { createdBy: userId }
      ];
    }
    
    const task = await Task.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı veya erişim izni yok' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    const createdBy = req.user.id;
    
    if (!title) {
      return res.status(400).json({ message: 'Görev adı gereklidir' });
    }
    
    const assignedUser = await User.findByPk(assignedTo || createdBy);
    
    if (!assignedUser) {
      return res.status(400).json({ message: 'Atanan kullanıcı bulunamadı' });
    }
    
    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'incomplete',
      assignedTo: assignedTo || createdBy,
      createdBy,
    });
    
    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
    });
    
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı' });
    }
    
    if (assignedTo) {
      const assignedUser = await User.findByPk(assignedTo);
      
      if (!assignedUser) {
        return res.status(400).json({ message: 'Atanan kullanıcı bulunamadı' });
      }
    }
    
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (assignedTo) task.assignedTo = assignedTo;
    
    await task.save();
    
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'username'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
    });
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı' });
    }
    
    await task.destroy();
    
    res.json({ message: 'Görev başarıyla silindi' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}; 