const { User } = require('../models');

const getAllUsers = async (req, res) => {
  try {
    const userRole = req.user.role;
    // admin olmayan kullanıcılara bilgi kısıtlama
    const attributes = userRole === 'admin' 
      ? ['id', 'username', 'role', 'createdAt', 'updatedAt']
      : ['id', 'username'];
    
    const users = await User.findAll({
      attributes,
      order: [['username', 'ASC']],
    });
    
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt'],
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, tcid, password, role } = req.body;
    
    if (!username || !tcid || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı, TC ID ve şifre gereklidir' });
    }
    
    if (!User.validateTCID(tcid)) {
      return res.status(400).json({ message: 'Geçersiz TC ID formatı' });
    }
    
    const existingUser = await User.findOne({ where: { tcid } });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Bu TC ID ile zaten bir kullanıcı var' });
    }
    
    const user = await User.create({
      username,
      tcid,
      password,
      role: role || 'user',
    });
    
    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Kullanıcı adı zaten alınmış' });
    }
    
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    if (username) user.username = username;
    if (password) user.password = password;
    if (role) user.role = role;
    
    await user.save();
    
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Kullanıcı adı zaten alınmış' });
    }
    
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    await user.destroy();
    
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}; 