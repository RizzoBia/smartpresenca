const knex = require('../config/data');


// REGISTRO DE PRESENÇAS 
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


// CONSULTA DE PRESENÇAS DE UM ALUNO
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


// ATUALIZAÇÃO DE PRESENÇA 
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


// RESUMO DE FREQUÊNCIA DE UM ALUNO
async function getFrequenciaByRA(req, res) {
    try {
        const { ra } = req.params;

        const frequencia = await knex('view_frequencia_aluno').where({ ra });

        if (!frequencia || frequencia.length === 0) {
            return res.status(404).json({ message: 'Nenhuma frequência encontrada para este RA.' });
        }

        res.json(frequencia);
    } catch (error) {
        console.error('Erro ao consultar frequência:', error);
        res.status(500).json({ message: 'Erro ao consultar frequência.' });
    }
}


// RESUMO DE FREQUÊNCIA DE UM PROFESSOR 
async function getResumoFrequenciaProfessor(req, res) {
    const { rm } = req.params;

    try {
        const resumo = await knex('Fato_presenca as fp')
            .join('Dim_aluno as a', 'fp.id_aluno', 'a.id_aluno')
            .join('Dim_disciplina as d', 'fp.id_disciplina', 'd.iddisciplina')
            .join('Dim_professor as p', 'fp.id_professor', 'p.idprofessor')
            .where('p.rm', rm)
            .groupBy('a.ra', 'a.nome', 'd.nome')
            .select(
                'a.ra',
                'a.nome as nome_aluno',
                'd.nome as disciplina'
            )
            .count('* as total_aulas')
            .select(knex.raw('SUM(CASE WHEN fp.presente = 1 THEN 1 ELSE 0 END) AS presencas'))
            .select(knex.raw('SUM(CASE WHEN fp.presente = 0 THEN 1 ELSE 0 END) AS faltas'));

        const resultado = resumo.map(r => {
            const taxa = (r.presencas / r.total_aulas) * 100;
            let status = 'APROVADO';
            if (taxa < 75) status = 'REPROVADO';
            else if (taxa < 80) status = 'ALERTA';

            return {
                ...r,
                taxa_presenca: `${taxa.toFixed(1)}%`,
                status
            };
        });

        res.json(resultado);

    } catch (error) {
        console.error('Erro ao buscar resumo de frequência do professor:', error);
        res.status(500).json({ message: 'Erro ao buscar resumo de frequência do professor', error: error.message });
    }
}

// Retorna todas as presenças individuais com ID para edição
async function getPresencasCompletasProfessor(req, res) {
    const { rm } = req.params;

    try {
        const resultado = await knex('Fato_presenca as fp')
            .join('Dim_aluno as a', 'fp.id_aluno', 'a.id_aluno')
            .join('Dim_disciplina as d', 'fp.id_disciplina', 'd.iddisciplina')
            .join('Dim_professor as p', 'fp.id_professor', 'p.idprofessor')
            .where('p.rm', rm)
            .select(
                'fp.id_presenca',
                'a.ra',
                'a.nome as nome_aluno',
                'd.nome as disciplina',
                'fp.data',
                'fp.presente'
            )
            .orderBy(['a.ra', 'fp.data']);

        res.json(resultado);
    } catch (err) {
        console.error('Erro ao buscar presenças completas:', err);
        res.status(500).json({ message: 'Erro ao buscar presenças completas' });
    }
}


module.exports = {
    create,
    getByAluno,
    update,
    getFrequenciaByRA,
    getResumoFrequenciaProfessor,
    getPresencasCompletasProfessor
};
