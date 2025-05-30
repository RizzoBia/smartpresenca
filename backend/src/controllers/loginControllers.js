const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/hash');
const knex = require('../config/data');
const ROLES = require('../utils/roles');

// Função para buscar aluno pelo RA
async function findAlunoByRA(ra) {
    try {
        return await knex('Dim_aluno').where({ ra }).first();
    } catch (err) {
        console.error('Erro ao buscar aluno:', err);
        return null;
    }
}

// Função para buscar professor pelo RM
async function findProfessorByRM(rm) {
    try {
        return await knex('Dim_professor').where({ rm }).first();
    } catch (err) {
        console.error('Erro ao buscar professor:', err);
        return null;
    }
}

async function login(req, res) {
    const { identifier, password } = req.body;

    let user = null;
    let role = null;
    let userId = null;

    user = await knex('admins').where({ username: identifier }).first();
    if (user) {
        role = ROLES.ADMIN;
        userId = user.id_admin; // ajuste conforme seu campo real
    }

    if (!user) {
        user = await findProfessorByRM(identifier);
        if (user) {
            role = ROLES.PROFESSOR;
            userId = user.idprofessor;
        }
    }

    if (!user) {
        user = await findAlunoByRA(identifier);
        if (user) {
            role = ROLES.ALUNO;
            userId = user.id_aluno;
        }
    }

    if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const match = await comparePassword(password, user.senha);
    if (!match) {
        return res.status(400).json({ message: 'Senha incorreta' });
    }

    const tokenPayload = {
        id: userId,
        role
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
}

module.exports = { login };
