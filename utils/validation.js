const { Joi } = require('express-validation')

const nameValidation = {
    body: Joi.object({
        name: Joi.string()
            .required()
    })
}

const createReturnValidation = {
    body: Joi.object({
        score: Joi.number()
            .required()
    }),
    params: Joi.object({
        userId: Joi.number()
            .integer()
            .required(),
        bookId: Joi.number()
            .integer()
            .required(),
    })
}

const createBorrowValidation = {
    params: Joi.object({
        userId: Joi.number()
            .integer()
            .required(),
        bookId: Joi.number()
            .integer()
            .required(),
    })
}

const userInfoValidation = {
    params: Joi.object({
        userId: Joi.number()
            .integer()
            .required()
    })
}

const bookInfoValidation = {
    params: Joi.object({
        bookId: Joi.number()
            .integer()
            .required()
    })
}

module.exports =  {
    nameValidation,
    createReturnValidation,
    createBorrowValidation,
    userInfoValidation,
    bookInfoValidation
}