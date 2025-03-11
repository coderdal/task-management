const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ortam değişkenleri
dotenv.config();

// routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');

// database
const { sequelize } = require('./config/database');

// express
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// main route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task Management API' });
});

const startServer = async () => {
  try {
    // database senkronizasyonu
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer(); 