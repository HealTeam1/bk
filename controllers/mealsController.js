const db = require('../config/db');

// ✅ Obtener comidas marcadas como consumidas
exports.getMeals = (req, res) => {
  const { email, plan } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'El parámetro email es requerido' });
  }

  let sql = 'SELECT meal, cantidad, consumed FROM user_meals WHERE email = ?';
  const params = [email];

  if (plan) {
    sql += ' AND plan = ?';
    params.push(plan);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('❌ Error al obtener meals:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    return res.status(200).json(result);
  });
};

// ✅ Guardar o actualizar comidas consumidas
exports.saveMeals = (req, res) => {
  const { email, plan, meals } = req.body;

  if (!email || !plan || !Array.isArray(meals)) {
    return res.status(400).json({ message: 'Faltan datos válidos en la solicitud' });
  }

  const values = meals.map(m => [
    email,
    plan,
    m.meal,
    m.cantidad || 0,
    m.consumed === true
  ]);

  const sql = `
    INSERT INTO user_meals (email, plan, meal, cantidad, consumed)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      cantidad = VALUES(cantidad),
      consumed = VALUES(consumed)
  `;

  db.query(sql, [values], (err) => {
    if (err) {
      console.error('❌ Error al guardar meals:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    return res.status(200).json({ message: 'Comidas actualizadas correctamente' });
  });
};

// ✅ Eliminar comidas por email y plan
exports.deleteMeals = (req, res) => {
  const { email, plan } = req.body;

  if (!email || !plan) {
    return res.status(400).json({ message: 'Faltan parámetros requeridos' });
  }

  const sql = 'DELETE FROM user_meals WHERE email = ? AND plan = ?';

  db.query(sql, [email, plan], (err) => {
    if (err) {
      console.error('❌ Error al borrar meals:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    return res.status(200).json({ message: 'Comidas eliminadas correctamente' });
  });
};

// ✅ Obtener resumen de comidas por cantidad
exports.getResumen = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email requerido' });
  }

  const sql = `
    SELECT meal, SUM(cantidad) AS cantidad
    FROM user_meals
    WHERE email = ?
    GROUP BY meal
    ORDER BY cantidad DESC
  `;

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener resumen:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    return res.status(200).json(result);
  });
};
