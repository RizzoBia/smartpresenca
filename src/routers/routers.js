// routers.js

const express = require('express');
const router = express.Router();
const studentsControllers = require('../controllers/studentsControllers');
const teachersControllers = require('../controllers/teachersControllers');

// Rotas para alunos
router.get('/students', studentsControllers.listAll);
router.get('/student/:ra', studentsControllers.getOne);
router.post('/student', studentsControllers.create);
router.put('/student/:ra', studentsControllers.update);
router.delete('/student/:ra', studentsControllers.remove);

// Rotas para professores
router.get('/teachers', teachersControllers.listAll);
router.get('/teacher/:rm', teachersControllers.getOne);
router.post('/teacher', teachersControllers.create);
router.put('/teacher/:rm', teachersControllers.update);
router.delete('/teacher/:rm', teachersControllers.remove);

// Rota para login
// router.post('/login', loginControllers.login);

module.exports = router;