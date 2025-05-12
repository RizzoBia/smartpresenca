const knex = require('../config/data')

class Users {
    
    async findAll() {
        try {
            let users = await knex.select(["id","name","email"]).table('users')
            return{validated: true, values: users}
        } catch (error) {
            return{validated: false, error: error}
        }
    }

    async findById(id) {
        try {
            let user = await knex.select(["id","name","email"]).where({id:id}).table("users")
            return user.length > 0 
            ? {validated: true, values: user}
            : {validated: true, values: undefined} 
        } catch (error) {
            return {validated: false, error: error} 
        }
    }
    
}

module.exports = new Users()
const knex = require('../config/data');

class Students {
    async findAll() {
        try {
            const students = await knex('Dim_aluno').select(['ra', 'nome', 'cpf', 'data_nascimento', 'sexo', 'endereco', 'cidade_atual', 'curso', 'bolsa']);
            return { validated: true, values: students };
        } catch (error) {
            return { validated: false, error };
        }
    }

    async findByRA(ra) {
        try {
            const student = await knex('Dim_aluno').where({ ra }).first();
            return student ? { validated: true, values: student } : { validated: true, values: undefined };
        } catch (error) {
            return { validated: false, error };
        }
    }

    async create(data) {
        try {
            await knex('Dim_aluno').insert(data);
            return { validated: true, message: 'Aluno cadastrado com sucesso' };
        } catch (error) {
            return { validated: false, error };
        }
    }

    async update(ra, data) {
        try {
            await knex('Dim_aluno').where({ ra }).update(data);
            return { validated: true, message: 'Aluno atualizado com sucesso' };
        } catch (error) {
            return { validated: false, error };
        }
    }

    async delete(ra) {
        try {
            await knex('Dim_aluno').where({ ra }).del();
            return { validated: true, message: 'Aluno removido com sucesso' };
        } catch (error) {
            return { validated: false, error };
        }
    }
}

module.exports = new Students();
