const knex = require('../../utils/knex');
const UserModel = require('../models/user').bindKnex(knex)

class UserService {

    static async getUser({name, id, throwError = true, next}) {
        try {
            let user = await UserModel.query().findOne({
                ...(!!id && {id: id}),
                ...(!!name && {name: name})
            })

            if (user) {
                user.books = {
                    past: await ReturnService.getUserReturnBooks({userId: user.id, next}),
                    present: await BorrowService.getUserActiveBorrowBooks({userId: user.id, next})
                }
                return user
            } else {
                if (throwError) {
                    next({
                        statusCode: 404,
                        message: "Not Found Error",
                        details: {
                            message: "User not found",
                            userId: id,
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

    static async getUsers({next}) {
        try {
            return await UserModel.query();
        } catch (err) {
            next({
                statusCode: 500,
                message: "Internal Server Error"
            });
        }
    }

    static async createUser({name, next}) {
        try {
            let user = await UserService.getUser({name, throwError: false, next});
            if (!user) {
                return UserModel.query().insert({name});
            } else {
                next({
                    statusCode: 402,
                    message: "Validation Error",
                    details: {
                        message: "User already exist",
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

module.exports = UserService