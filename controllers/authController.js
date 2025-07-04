const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para usar JWT_SECRET

// ✅ REGISTRO DE USUARIO
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('❌ Error en SELECT:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err) => {
          if (err) {
            console.error('❌ Error en INSERT:', err);
            return res.status(500).json({ message: 'Error al registrar usuario' });
          }

          return res.status(201).json({ message: 'Usuario registrado' });
        }
      );
    } catch (error) {
      console.error('❌ Error al encriptar contraseña:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
};

// ✅ LOGIN DE USUARIO
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('❌ Error en SELECT:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: 'Correo no registrado' });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('❌ Error al comparar contraseñas:', err);
        return res.status(500).json({ message: 'Error al verificar la contraseña' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: 'Login exitoso', token });
    });
  });
};
