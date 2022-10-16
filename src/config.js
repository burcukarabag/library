//

const dotenv = require('dotenv');
const result = dotenv.config();
let envs;

if (result.error) {
    envs = process.env;
} else {
    envs = result.parsed
}

let config = {
    api: {
        port: envs.SERVER_PORT || 3000,
        url: envs.SERVER_URL || "http://127.0.0.1"
    },
    db: {
        host: envs.PSQL_HOST,
        port: envs.PSQL_PORT,
        username: envs.PSQL_USERNAME,
        password: envs.PSQL_PASSWORD,
        name: envs.PSQL_DB_NAME,
        schema: envs.PSQL_SCHEMA
    }
};

global['config'] = config;
module.exports = config;