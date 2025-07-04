const db = require('../config/db');

// ✅ Actualizar perfil de usuario
exports.updateProfile = (req, res) => {
  const { email, name, age, weight, height } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El correo es obligatorio' });
  }

  const sql = `
    UPDATE users 
    SET name = ?, age = ?, weight = ?, height = ?
    WHERE email = ?
  `;

  db.query(sql, [name, age, weight, height, email], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar perfil:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Perfil actualizado correctamente' });
  });
};

// ✅ Obtener perfil de usuario por email
exports.getProfile = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'El correo es obligatorio' });
  }

  const sql = 'SELECT name, age, weight, height FROM users WHERE email = ?';

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener perfil:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(result[0]);
  });
};
