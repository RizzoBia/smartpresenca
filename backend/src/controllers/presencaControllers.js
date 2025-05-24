const knex = require('../config/data');

// Criar presença
async function create(req, res) {
    try {
        const { ra, id_disciplina, id_turma, id_tempo, rm, id_localizacao, data, presente } = req.body;

        // Buscar id_aluno pelo RA
        const aluno = await knex('Dim_aluno').where({ ra }).first();
        if (!aluno) {
            return res.status(404).json({ message: 'Aluno não encontrado pelo RA.' });
        }

        // Buscar id_professor pelo RM
        const professor = await knex('Dim_professor').where({ rm }).first();
        if (!professor) {
            return res.status(404).json({ message: 'Professor não encontrado pelo RM.' });
        }

        await knex('Fato_presenca').insert({
            id_aluno: aluno.id_aluno,
            id_disciplina,
            id_turma,
            id_tempo,
            id_professor: professor.id_professor,
            id_localizacao,
            data,
            presente
        });

        res.status(201).json({ message: 'Presença registrada com sucesso!' });
    } catch (err) {
        console.error('Erro ao registrar presença:', err);
        res.status(500).json({ message: 'Erro ao registrar presença' });
    }
}

// Consultar presença de um aluno via RA
async function getByAluno(req, res) {
    try {
        const { ra } = req.params;

        const frequencia = await knex('view_frequencia_aluno').where({ ra });

        if (frequencia.length === 0) {
            return res.status(404).json({ message: 'Nenhum dado de frequência encontrado para este RA.' });
        }

        res.json(frequencia);
    } catch (err) {
        console.error('Erro ao consultar frequência:', err);
        res.status(500).json({ message: 'Erro ao consultar frequência' });
    }
}


// Atualizar presença
async function update(req, res) {
    try {
        const { id } = req.params;
        const { presente } = req.body;

        await knex('Fato_presenca').where({ id_presenca: id }).update({ presente });

        res.json({ message: 'Presença atualizada com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar presença:', err);
        res.status(500).json({ message: 'Erro ao atualizar presença' });
    }
}

module.exports = {
    create,
    getByAluno,
    update
};
