require('dotenv').config();

const knex = require('../config/data');
const { hashPassword } = require('../utils/hash');


class StudentsControllers {
    async listAll(req, res) {
        try {
            const students = await knex('Dim_aluno').select(['ra', 'nome', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'cidade_atual', 'curso', 'bolsa']);
            res.status(200).json({ success: true, students });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao listar alunos', error });
        }
    }

    async getOne(req, res) {
        try {
            const student = await knex('Dim_aluno').where({ ra: req.params.ra }).first();
            student ? res.status(200).json({ success: true, student }) : res.status(404).json({ success: false, message: 'Aluno não encontrado' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao buscar aluno', error });
        }
    }

    async create(req, res) {
        try {
            const { nome, cpf, data_nascimento, sexo, endereco, cidade_atual, curso, bolsa, ra, senha } = req.body;
            const hashedPassword = await hashPassword(senha);
            await knex('Dim_aluno').insert({ nome, cpf, data_nascimento, sexo, endereco, cidade_atual, curso, bolsa, ra, senha: hashedPassword });
            res.status(201).json({ success: true, message: 'Aluno cadastrado com sucesso' });
        } catch (error) {
            console.error('Erro ao cadastrar aluno:', error);
            res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno', error: error.message });
        }
    }
    async update(req, res) {
        try {
            const { nome, cpf, data_nascimento, sexo, endereco, cidade_atual, curso, bolsa } = req.body;
            await knex('Dim_aluno').where({ ra: req.params.ra }).update({ nome, cpf, data_nascimento, sexo, endereco, cidade_atual, curso, bolsa });
            res.status(200).json({ success: true, message: 'Aluno atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao atualizar aluno', error });
        }
    }

    async remove(req, res) {
        try {
            await knex('Dim_aluno').where({ ra: req.params.ra }).del();
            res.status(200).json({ success: true, message: 'Aluno removido com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Erro ao remover aluno', error });
        }
    }
    async getResumo(req, res) {
        try {
            const { ra } = req.params;
            const aluno = await knex('Dim_aluno').where({ ra }).first();

            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado' });
            }

            res.status(200).json({
                nome: aluno.nome,
                curso: aluno.curso
            });
        } catch (error) {
            console.error('Erro ao buscar resumo do aluno:', error);
            res.status(500).json({ message: 'Erro ao buscar resumo do aluno', error: error.message });
        }
    }

    async getAulas(req, res) {
        const { ra } = req.params;
        try {
            const aulas = await knex('view_aulas_aluno').where({ ra_aluno: ra });
            res.json(aulas);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar aulas do aluno', error: err.message });
        }
    }

}

module.exports = new StudentsControllers();
