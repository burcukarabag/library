const {Model} = require('objection');

class Borrow extends Model {

    static get tableName() {
        return 'borrow';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'bookId', 'status'],
            properties: {
                userId: {type: 'integer'},
                bookId: {type: 'integer'},
                status: {type: 'integer'}
                // borrowingDate: {type: 'dateTime'},
                // returningDate: {type: 'datetime', nullable: true}
            }
        };
    }

    static relationMappings() {
        return {
            book: {
                relation: Model.HasOneRelation,
                modelClass: require('./book'),
                join: {
                    from: 'borrow.bookId',
                    to: 'book.id'
                }
            },
            user: {
                relation: Model.HasOneRelation,
                modelClass: require('./user'),
                join: {
                    from: 'borrow.userId',
                    to: 'user.id'
                }
            }
        }
    }
}

module.exports = Borrow;