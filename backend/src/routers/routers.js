const express = require('express');
const router = express.Router();

const loginControllers = require('../controllers/loginControllers');
const studentsControllers = require('../controllers/studentsControllers');
const teachersControllers = require('../controllers/teachersControllers');
const presencaController = require('../controllers/presencaControllers');
const userController = require('../controllers/userControllers');
const { authorize } = require('../middleware/auth_unificado');

//   LOGIN  
router.post('/login', loginControllers.login);

//   PERFIL DO USUÁRIO  
router.get('/me', authorize(['aluno', 'professor', 'admin']), userController.profile);

//   ALUNOS  
router.get('/students', authorize(['admin', 'professor']), studentsControllers.listAll);
router.get('/student/:ra', authorize(['admin', 'professor', 'aluno']), studentsControllers.getOne);
router.post('/student', authorize(['admin']), studentsControllers.create);
router.put('/student/:ra', authorize(['admin', 'professor']), studentsControllers.update);
router.delete('/student/:ra', authorize(['admin']), studentsControllers.remove);
router.get('/student/resumo/:ra', authorize(['aluno']), studentsControllers.getResumo);
router.get('/student/aulas/:ra', authorize(['aluno']), studentsControllers.getAulas);

//   PROFESSORES  
router.get('/teachers', authorize(['admin']), teachersControllers.listAll);
router.get('/teacher/:rm', authorize(['admin', 'professor']), teachersControllers.getOne);
router.post('/teacher', authorize(['admin']), teachersControllers.create);
router.put('/teacher/:rm', authorize(['admin']), teachersControllers.update);
router.delete('/teacher/:rm', authorize(['admin']), teachersControllers.remove);
router.get('/teacher/aulas/:rm', authorize(['professor']), teachersControllers.getAulas);
router.get('/teacher/resumo/:rm', authorize(['professor']), teachersControllers.getResumo);

//   PRESENÇA  
router.post('/presenca', authorize(['professor']), presencaController.create);
router.put('/presenca/:id', authorize(['professor', 'admin']), presencaController.update);
router.get('/presenca/student/:ra', authorize(['admin', 'professor', 'aluno']), presencaController.getByAluno);
router.get('/presenca/teacher/:rm/resumo', authorize(['professor', 'admin']), presencaController.getResumoFrequenciaProfessor);

module.exports = router;
