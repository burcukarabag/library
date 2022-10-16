const {Model} = require('objection');

class Book extends Model {

    static get tableName() {
        return 'book';
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

module.exports = Book;