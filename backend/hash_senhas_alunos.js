require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require('./src/config/data'); // Ajuste o caminho conforme sua estrutura de pastas

async function hashSenhasAlunos() {
    try {
        const alunos = await knex('Dim_aluno').select('id_aluno', 'senha');

        for (let aluno of alunos) {
            if (aluno.senha && !aluno.senha.startsWith('$2b$')) { // Evita rehash
                const hash = await bcrypt.hash(aluno.senha, 10);
                await knex('Dim_aluno')
                    .where({ id_aluno: aluno.id_aluno })
                    .update({ senha: hash });
                console.log(`Senha do aluno ID ${aluno.id_aluno} atualizada.`);
            }
        }

        console.log('✅ Processo de hash de alunos concluído!');
        process.exit();
    } catch (err) {
        console.error('❌ Erro ao hashear senhas de alunos:', err);
        process.exit(1);
    }
}

hashSenhasAlunos();
