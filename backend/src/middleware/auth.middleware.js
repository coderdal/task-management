const jwt = require('jsonwebtoken');
const { User } = require('../models');

// oturum kontrolü middleware
const authenticate = async (req, res, next) => {
  try {
    // token alma
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    const token = authHeader.split(' ')[1];
        
    // token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // kullanıcı arama
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }
    
    // sonraki routelar için kullanıcı bilgileri
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Geçersiz token, yetkilendirme reddedildi' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token süresi doldu, yetkilendirme reddedildi' });
    }
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// admin kontrolü middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Yetkisiz erişim, admin yetkileri gerekli' });
  }
};

// görev oluşturucusu veya admin kontrolü middleware
const isTaskOwnerOrAdmin = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // admin ise erişim izni
    if (userRole === 'admin') {
      return next();
    }
    
    // görev arama
    const Task = require('../models/task.model');
    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // kullanıcı oluşturucu veya atanan kullanıcı ise erişim izni
    if (task.createdBy === userId || task.assignedTo === userId) {
      return next();
    }
    
    // admin veya sahibi değilse erişim reddedildi
    res.status(403).json({ message: 'Yetkisiz erişim, bu işlemi gerçekleştirmek için yetkiniz yok' });
  } catch (error) {
    console.error('Task owner check error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isTaskOwnerOrAdmin,
}; 