const express = require('express');
const router = express.Router();

const loginControllers = require('../controllers/loginControllers');
const studentsControllers = require('../controllers/studentsControllers');
const teachersControllers = require('../controllers/teachersControllers');
const presencaController = require('../controllers/presencaControllers');
const userController = require('../controllers/userControllers');
const frequenciaController = require('../controllers/frequenciaControllers');
const { authorize } = require('../middleware/auth_unificado');  // atenção: "middlewareS" ou "middleware"

router.post('/login', loginControllers.login);

// Rotas para alunos
router.get('/students', authorize(['admin', 'professor']), studentsControllers.listAll);
router.get('/student/:ra', authorize(['admin', 'professor', 'aluno']), studentsControllers.getOne);
router.post('/student', authorize(['admin']), studentsControllers.create);
router.put('/student/:ra', authorize(['admin', 'professor']), studentsControllers.update);
router.delete('/student/:ra', authorize(['admin']), studentsControllers.remove);

// Rotas para professores
router.get('/teachers', authorize(['admin']), teachersControllers.listAll);
router.get('/teacher/:rm', authorize(['admin', 'professor']), teachersControllers.getOne);
router.post('/teacher', authorize(['admin']), teachersControllers.create);
router.put('/teacher/:rm', authorize(['admin']), teachersControllers.update);
router.delete('/teacher/:rm', authorize(['admin']), teachersControllers.remove);

// Rotas de presença
router.put('/presenca/:id', authorize(['professor', 'admin']), presencaController.update);

// Rota para perfil do usuário autenticado
router.get('/me', authorize(['aluno', 'professor', 'admin']), userController.profile);

router.post('/presenca', presencaController.create);
router.get('/frequencia/:ra', authorize(['admin', 'professor', 'aluno']), presencaController.getByAluno);
router.put('/presenca/:id', authorize(['professor']), presencaController.update);

router.get('/frequencia/:ra', authorize(['aluno', 'professor', 'admin']), frequenciaController.getFrequenciaByRA);

router.get('/aluno/resumo/:ra', authorize(['aluno']), studentsControllers.getResumo);

router.get('/professor/aulas/:rm', authorize(['professor']), teachersControllers.getAulas);
router.get('/professor/resumo/:rm', authorize(['professor']), teachersControllers.getResumo);
router.get('/frequencia/professor/:rm/resumo', authorize(['professor', 'admin']), frequenciaController.getResumoFrequenciaProfessor);

router.get('/aluno/aulas/:ra', authorize(['aluno']), studentsControllers.getAulas);
module.exports = router;
