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

module.exports = { getFrequenciaByRA };
