const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: '34.87.116.20',
    database: 'user_profile',
    password: 'cs3219g53',
    port: 5432,
})

module.exports = pool