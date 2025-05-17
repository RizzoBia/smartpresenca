require('dotenv').config()
const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host: process.env.HOST, 
      port: 3306,
      user: process.env.USER, 
      password: process.env.PASSWORD, 
      database: process.env.DATABASE, 
    },
  })

module.exports = knex