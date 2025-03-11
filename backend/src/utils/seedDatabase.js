const { User, Task } = require('../models');
const { sequelize } = require('../config/database');

const seedDatabase = async () => {
  try {
    // database senkronizasyonu
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // admin kullanıcısı
    const admin = await User.create({
      username: 'admin',
      tcid: '12345678901',
      password: 'admin123',
      role: 'admin',
    });

    // normal kullanıcı
    const user = await User.create({
      username: 'user',
      tcid: '98765432109',
      password: 'user123',
      role: 'user',
    });

    console.log('Database seed success');
  } catch (error) {
    console.error('Error in seeding:', error);
  } finally {
    await sequelize.close();
  }
};

// harici olarak çalıştırma
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 