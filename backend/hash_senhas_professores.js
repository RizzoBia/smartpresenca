require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require('./src/config/data'); // Ajuste o caminho conforme a sua estrutura

async function hashSenhasProfessores() {
    try {
        const professores = await knex('Dim_professor').select('idprofessor', 'senha');

        for (let prof of professores) {
            if (prof.senha && !prof.senha.startsWith('$2b$')) { // Evita hashear de novo se já for hash
                const hash = await bcrypt.hash(prof.senha, 10);
                await knex('Dim_professor')
                    .where({ idprofessor: prof.idprofessor })
                    .update({ senha: hash });
                console.log(`Senha do professor ID ${prof.idprofessor} atualizada.`);
            }
        }

        console.log('✅ Processo de hash concluído!');
        process.exit();
    } catch (err) {
        console.error('❌ Erro ao hashear senhas:', err);
        process.exit(1);
    }
}

hashSenhasProfessores();
