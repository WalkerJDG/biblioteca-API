require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express(); // <-- 🔹 CREA app ANTES de usar app.use()

app.use(cors());
app.use(express.json());

// 🔹 Aquí van tus rutas
app.use('/books', require('./routes/books'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users')); // <-- ESTA DEBE IR AQUÍ

// 🔹 Sincronizar DB y arrancar
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server', error);
  }
})();
