const Knex = require('knex');

const knex = Knex({
    client: 'pg',
    searchPath: [config.db.schema],
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name
    }
});

module.exports = knex;