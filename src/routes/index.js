const express = require("express");
const router = express.Router();

const {
    nameValidation,
    createReturnValidation,
    createBorrowValidation,
    userInfoValidation,
    bookInfoValidation
} = require("../../utils/validation");

const {validate} = require('express-validation')

const {
    getBook,
    getBooks,
    createBook
} = require("../services/bookService")

const {
    getUser,
    getUsers,
    createUser
} = require("../services/userService")

const {
    createReturn
} = require("../services/returnService")

const {
    createBorrow
} = require("../services/borrowService")

router.get("/users", async function (req, res, next) {
    let result = await getUsers({next});
    res.status(200).json(result)
})

router.post("/users", validate(nameValidation, {}, {}), async function (req, res, next) {
    let result = await createUser({name: req.body.name, next});
    res.status(200).json(result)
})

router.get("/users/:userId", validate(userInfoValidation, {}, {}), async function (req, res, next) {
    let result = await getUser({id: req.params.userId, next});
    res.status(200).json(result)
})

router.get("/books", async function (req, res, next) {
    let result = await getBooks({next});
    res.status(200).json(result)
})

router.post("/books", validate(nameValidation, {}, {}), async function (req, res, next) {
    let result = await createBook({name: req.body.name, next});
    res.status(200).json(result)

})

router.get("/books/:bookId", validate(bookInfoValidation, {}, {}), async function (req, res, next) {
    let result = await getBook({id: req.params.bookId, next});
    res.status(200).json(result)
})

router.post("/users/:userId/borrow/:bookId", validate(createBorrowValidation, {}, {}), async function (req, res, next) {
    let result = await createBorrow({userId: req.params.userId, bookId: req.params.bookId, next});
    res.status(200).json(result)
})

router.post("/users/:userId/return/:bookId", validate(createReturnValidation, {}, {}), async function (req, res, next) {
    let result = await createReturn({
        userId: req.params.userId,
        bookId: req.params.bookId,
        userScore: req.body.score,
        next
    });
    res.status(200).json(result)
})

module.exports = router