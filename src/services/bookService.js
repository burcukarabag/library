const knex = require('../../utils/knex');
const BookModel = require('../models/book').bindKnex(knex)

class BookService {
    static async getBook({name, id, throwError = true, next}) {
        try {
            let book = await BookModel.query().findOne({
                ...(!!id && {id: id}),
                ...(!!name && {name: name})
            })

            if (book) {
                let score = await ReturnService.getBookWithScore({bookId: book.id, next})
                book.score = score ? score : -1;
                return book
            } else {
                if (throwError) {
                    next({
                        statusCode: 404,
                        message: "Not Found Error",
                        details: {
                            message: "Book not found",
                            bookId: id,
                            name
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

    static async getBooks({next}) {
        try {
            return await BookModel.query();
        } catch (err) {
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

    static async createBook({name, next}) {
        try {
            let book = await BookService.getBook({name, throwError: false, next});
            if (!book) {
                await BookModel.query().insert({name});
            } else {
                next({
                    statusCode: 402,
                    message: "Validation Error",
                    details: {
                        message: "Book already exist",
                        name
                    }
                })
            }
        } catch (err) {
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = BookService