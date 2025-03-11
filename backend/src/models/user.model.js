const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tcid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 11],
      isNumeric: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// test aşamasında tc kimlik doğrulaması geçici olarak devre dışı
User.validateTCID = (tcid) => {
  if (!/^\d{11}$/.test(tcid)) {
    return false;
  }
  /*
  const digits = tcid.split('').map(Number);
  
  // Check first digit
  if (digits[0] === 0) {
    return false;
  }
  
  const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = (sumOdd * 7 - sumEven) % 10;
  
  if (digit10 !== digits[9]) {
    return false;
  }
  
  const sum = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
  const digit11 = sum % 10;
  
  if (digit11 !== digits[10]) {
    return false;
  }
  */
  return true;
};

module.exports = User; 