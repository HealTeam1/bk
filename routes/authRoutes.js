const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const mealsController = require('../controllers/mealsController');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error en el registro
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtener perfil de usuario
 *     tags: [Profile]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email del usuario
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/profile', profileController.getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               edad:
 *                 type: integer
 *               peso:
 *                 type: number
 *               altura:
 *                 type: number
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Error al actualizar
 */
router.put('/profile', profileController.updateProfile);

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Obtener comidas registradas por el usuario
 *     tags: [Meals]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email del usuario
 *     responses:
 *       200:
 *         description: Lista de comidas
 */
router.get('/meals', mealsController.getMeals);

/**
 * @swagger
 * /meals:
 *   put:
 *     summary: Guardar comidas marcadas como consumidas
 *     tags: [Meals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               plan:
 *                 type: string
 *               meals:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     meal:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *                     consumed:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Comidas guardadas
 *       500:
 *         description: Error del servidor
 */
router.put('/meals', mealsController.saveMeals);

/**
 * @swagger
 * /meals/resumen:
 *   get:
 *     summary: Obtener resumen de comidas consumidas
 *     tags: [Meals]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email del usuario
 *     responses:
 *       200:
 *         description: Lista de comidas con cantidad
 */
router.get('/meals/resumen', mealsController.getResumen);

/**
 * @swagger
 * /meals:
 *   delete:
 *     summary: Eliminar todas las comidas del usuario
 *     tags: [Meals]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email del usuario
 *     responses:
 *       200:
 *         description: Comidas eliminadas
 */
router.delete('/meals', mealsController.deleteMeals);

module.exports = router;
