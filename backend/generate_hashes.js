// require('dotenv').config();
// const bcrypt = require('bcrypt');
// const knex = require('knex')({
//     client: 'mysql2',
//     connection: {
//         host: process.env.HOST,
//         port: 3306,
//         user: process.env.USER,
//         password: process.env.PASSWORD,
//         database: process.env.DATABASE
//     }
// });

// const saltRounds = 10;

// async function hashPassword(password) {
//     return await bcrypt.hash(password, saltRounds);
// }

// async function updateSenhas() {
//     try {
//         const alunos = await knex('Dim_aluno').select('id_aluno');
//         for (const aluno of alunos) {
//             const senhaHash = await hashPassword('senha123');
//             await knex('Dim_aluno')
//                 .where({ id_aluno: aluno.id_aluno })
//                 .update({ senha: senhaHash });
//             console.log(`Senha atualizada para aluno ID: ${aluno.id_aluno}`);
//         }

//         const professores = await knex('Dim_professor').select('id_professor');
//         for (const professor of professores) {
//             const senhaHash = await hashPassword('senha123');
//             await knex('Dim_professor')
//                 .where({ id_professor: professor.id_professor })
//                 .update({ senha: senhaHash });
//             console.log(`Senha atualizada para professor ID: ${professor.id_professor}`);
//         }

//         console.log('Senhas atualizadas com sucesso!');
//     } catch (err) {
//         console.error('Erro ao atualizar senhas:', err);
//     } finally {
//         await knex.destroy();
//     }
// }

// updateSenhas();


// const bcrypt = require('bcrypt');

// bcrypt.hash('senha123', 10).then(hash => {
//     console.log('Hash gerado:', hash);
// });



