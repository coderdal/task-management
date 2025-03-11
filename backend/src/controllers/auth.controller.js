const jwt = require('jsonwebtoken');
const { User } = require('../models');

// login doğrulama
const login = async (req, res) => {
  try {
    const { tcid, password } = req.body;

    // giriş bilgileri doğrulama
    if (!tcid || !password) {
      return res.status(400).json({ message: 'TC ID ve şifre gereklidir' });
    }

    // TC ID formatı doğrulama
    if (!User.validateTCID(tcid)) {
      return res.status(400).json({ message: 'Geçersiz TC ID formatı' });
    }

    // TC ID ile kullanıcı arama
    const user = await User.findOne({ where: { tcid } });

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz giriş bilgileri' });
    }

    // şifre doğrulama
    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz giriş bilgileri' });
    }

    // JWT token oluşturma
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // kullanıcı bilgileri ve token döndürme
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// mevcut kullanıcı controller
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      user: req.user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// kayıt olma controller
const signup = async (req, res) => {
  try {
    const { username, tcid, password } = req.body;

    // giriş bilgileri doğrulama
    if (!username || !tcid || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı, TC ID ve şifre gereklidir' });
    }

    // TC ID formatı doğrulama
    if (tcid.length !== 11 || !/^\d+$/.test(tcid)) {
      return res.status(400).json({ message: 'TCID 11 haneli olmalıdır' });
    }

    // TC kimlik farklı üyelik kontrolü
    const existingUser = await User.findOne({ where: { tcid } });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu TC ID ile zaten bir kullanıcı var' });
    }

    // kullanıcı adı var mı kontrolü
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Kullanıcı adı zaten alınmış' });
    }

    // yeni kullanıcı oluşturma
    const user = await User.create({
      username,
      tcid,
      password,
      role: 'user',
    });

    // JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // response
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Kullanıcı adı veya TC ID zaten var' });
    }
    
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = {
  login,
  getCurrentUser,
  signup,
}; 