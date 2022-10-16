const knex = require('../../utils/knex');
const BorrowModel = require('../models/borrow').bindKnex(knex)

class BorrowService {

    static async getBorrow({userId, bookId, throwError = true, next}) {

        try {
            let borrow = await BorrowModel.query().findOne({
                ...(!!bookId && {bookId}),
                ...(!!userId && {userId}),
                status: BorrowStatus.active
            })
            if (borrow) {
                return borrow
            } else {
                if (throwError) {
                    next({
                        statusCode: 404,
                        message: "Not Found Error",
                        details: {
                            message: "No active borrow found"
                        }
                    })
                } else {
                    return null
                }
            }
        } catch (err) {
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

    static async createBorrow({userId, bookId, next}) {
        try {
            let book = await BookService.getBook({id: bookId, next});
            let user = await UserService.getUser({id: userId, next});
            let borrow = await BorrowService.getBorrow({bookId: book.id, throwError: false, next})

            if (borrow) {
                next({
                    statusCode: 400,
                    message: "Bad Request Error",
                    details: {
                        message: "The book was borrowed by someone else"
                    }
                })
            } else {
                return await BorrowModel
                    .query()
                    .insert({userId: user.id, bookId: book.id, status: BorrowStatus.active});
            }
        } catch (err) {
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

    static async getUserActiveBorrowBooks({userId, next}) {
        try {
            return await BorrowModel.query()
                .select('b.name as name')
                .joinRelated('book', {alias: 'b'})
                .where("userId", userId)
                .andWhere("status", BorrowStatus.active);
        } catch (err) {
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

    static async updateBorrowStatus({userId, bookId, trx, next}) {
        try {
            await trx('borrow')
                .update({status: BorrowStatus.inactive}).where({userId, bookId});
        } catch (err) {
            await trx.rollback()
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

}

module.exports = BorrowService