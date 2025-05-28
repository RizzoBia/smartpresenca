const knex = require('../config/data');

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

module.exports = { 
    getFrequenciaByRA,
    getResumoFrequenciaProfessor
};