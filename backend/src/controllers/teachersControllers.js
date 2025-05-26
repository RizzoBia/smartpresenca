require('dotenv').config();

const knex = require('../config/data');

class TeachersControllers {
    async listAll(req, res) {
        try {
            const teachers = await knex('Dim_professor').select(['rm', 'nome', 'cpf', 'titulacao']);
            res.status(200).json({ success: true, teachers });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao listar professores', error });
        }
    }

    async getOne(req, res) {
        try {
            const teacher = await knex('Dim_professor').where({ rm: req.params.rm }).first();
            teacher ? res.status(200).json({ success: true, teacher }) : res.status(404).json({ success: false, message: 'Professor não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao buscar professor', error });
        }
    }

    async create(req, res) {
        try {
            const { nome, cpf, titulacao, rm } = req.body;
            await knex('Dim_professor').insert({ nome, cpf, titulacao, rm });
            res.status(201).json({ success: true, message: 'Professor cadastrado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao cadastrar professor', error });
        }
    }

    async update(req, res) {
        try {
            const { nome, cpf, titulacao } = req.body;
            await knex('Dim_professor').where({ rm: req.params.rm }).update({ nome, cpf, titulacao });
            res.status(200).json({ success: true, message: 'Professor atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao atualizar professor', error });
        }
    }

    async remove(req, res) {
        try {
            await knex('Dim_professor').where({ rm: req.params.rm }).del();
            res.status(200).json({ success: true, message: 'Professor removido com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao remover professor', error });
        }
    }
    async getAulas(req, res) {
        const { rm } = req.params;

        try {
            const aulas = await knex('view_aulas_professor')
                .where({ rm_professor: rm })
                .select(
                    'nome_disciplina as disciplina',
                    'dia_semana',
                    'hora_inicio',
                    'hora_fim',
                    'nome_turma',
                    'sala',
                    'bloco',
                    'campus'
                );

            if (!aulas || aulas.length === 0) {
                return res.status(404).json({ message: 'Nenhuma aula encontrada para este professor.' });
            }

            res.status(200).json(aulas);

        } catch (err) {
            console.error('Erro ao buscar aulas do professor:', err);
            res.status(500).json({ message: 'Erro ao buscar aulas do professor', error: err.message });
        }
    }
    async getResumo(req, res) {
        try {
            const { rm } = req.params;
            const professor = await knex('Dim_professor').where({ rm }).first();

            if (!professor) {
                return res.status(404).json({ message: 'Professor não encontrado' });
            }

            res.status(200).json({
                nome: professor.nome,
                titulacao: professor.titulacao
            });
        } catch (error) {
            console.error('Erro ao buscar resumo do professor:', error);
            res.status(500).json({ message: 'Erro ao buscar resumo do professor', error: error.message });
        }
    }



}

module.exports = new TeachersControllers();
