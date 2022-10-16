const knex = require('../../utils/knex');
const ReturnModel = require('../models/return').bindKnex(knex)

class ReturnService {

    static async getUserReturnBooks({userId, next}) {
        try {
            return await ReturnModel.query()
                .from("return")
                .select('b.name as name', 'return.userScore as userScore')
                .joinRelated('book', {alias: 'b'})
                .where("userId", userId);
        } catch (err) {
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

    static async getBookWithScore({bookId, next}) {
        try {
            return (await knex('return')
                .sum('userScore')
                .where({bookId}))[0].sum
        } catch (err) {
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

    static async createReturn({userId, bookId, userScore, next}) {
        const trx = await knex.transaction();
        try {
            let book = await BookService.getBook({id: bookId, next});
            let user = await UserService.getUser({id: userId, next});
            let borrow = await BorrowService.getBorrow({userId: user.id, bookId: book.id, next})
            if (borrow) {
                await BorrowService.updateBorrowStatus({bookId: book.id, userId: user.id, trx, next})
                await trx('return').insert({
                    userId,
                    bookId,
                    userScore
                });
                await trx.commit();
            } else {
                await trx.rollback();
                next({
                    statusCode: 404,
                    message: "Not Found Error",
                    details: {
                        message: "No active borrow found"
                    }
                })
            }
        } catch (err) {
            await trx.rollback();
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

}

module.exports = ReturnService