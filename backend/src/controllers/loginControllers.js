const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/hash');
const knex = require('../config/data');
const ROLES = require('../utils/roles');

// Função para buscar aluno pelo RA
async function findAlunoByRA(ra) {
    try {
        const aluno = await knex('Dim_aluno').where({ ra }).first();
        return aluno;
    } catch (err) {
        console.error('Erro ao buscar aluno:', err);
        return null;
    }
}

// Função para buscar professor pelo RM
async function findProfessorByRM(rm) {
    try {
        const professor = await knex('Dim_professor').where({ rm }).first();
        return professor;
    } catch (err) {
        console.error('Erro ao buscar professor:', err);
        return null;
    }
}

async function login(req, res) {
    const { identifier, password, role } = req.body;

    let user;

    if (role === ROLES.ALUNO) {
        user = await findAlunoByRA(identifier);
    } else if (role === ROLES.PROFESSOR) {
        user = await findProfessorByRM(identifier);
    } else if (role === ROLES.ADMIN) {
        user = await knex('admins').where({ username: identifier }).first();
    } else {
        return res.status(400).json({ message: 'Role inválida' });
    }

    if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const match = await comparePassword(password, user.senha);
    if (!match) {
        return res.status(400).json({ message: 'Senha incorreta' });
    }

    const tokenPayload = {
        id: user.id_aluno || user.idprofessor || user.id,
        role: role
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
}

module.exports = { login };
