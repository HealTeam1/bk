const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/db');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // 👈 import correcto

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

// 👇 esta línea crea la ruta con la documentación interactiva
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger en: http://localhost:${PORT}/api-docs`);
});
