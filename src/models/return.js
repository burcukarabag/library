const {Model} = require('objection');

class Return extends Model {

    static get tableName() {
        return 'return';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'bookId', 'userScore'],
            properties: {
                userId: {type: 'integer'},
                bookId: {type: 'integer'},
                userScore: {type: 'integer'}
            }
        };
    }

    static relationMappings() {
        return {
            book: {
                relation: Model.HasOneRelation,
                modelClass: require('./book'),
                join: {
                    from: 'return.bookId',
                    to: 'book.id'
                }
            },
            user: {
                relation: Model.HasOneRelation,
                modelClass: require('./user'),
                join: {
                    from: 'return.userId',
                    to: 'user.id'
                }
            }
        }
    }
}

module.exports = Return;