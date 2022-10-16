const {Model} = require('objection');

class User extends Model {

    static get tableName() {
        return 'user';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                name: {type: 'string'}
            }
        };
    }
}

module.exports = User;