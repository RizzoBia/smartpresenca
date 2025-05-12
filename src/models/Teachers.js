const knex = require('../config/data');

class Teachers {
    async findAll() {
        try {
            const teachers = await knex('Dim_professor').select(['rm', 'nome', 'cpf', 'titulacao']);
            return { validated: true, values: teachers };
        } catch (error) {
            return { validated: false, error };
        }
    }

    async findByRM(rm) {
        try {
            const teacher = await knex('Dim_professor').where({ rm }).first();
            return teacher ? { validated: true, values: teacher } : { validated: true, values: undefined };
        } catch (error) {
            return { validated: false, error };
        }
    }

    async create(data) {
        try {
            await knex('Dim_professor').insert(data);
            return { validated: true, message: 'Professor cadastrado com sucesso' };
        } catch (error) {
            return { validated: false, error };
        }
    }

    async update(rm, data) {
        try {
            await knex('Dim_professor').where({ rm }).update(data);
            return { validated: true, message: 'Professor atualizado com sucesso' };
        } catch (error) {
            return { validated: false, error };
        }
    }

    async delete(rm) {
        try {
            await knex('Dim_professor').where({ rm }).del();
            return { validated: true, message: 'Professor removido com sucesso' };
        } catch (error) {
            return { validated: false, error };
        }
    }
}

module.exports = new Teachers();