require('./config');
require('../utils/enums');
require("./services");

const { ValidationError } = require('express-validation')
const bodyParser = require('body-parser')
const express = require("express");
const app = express();
const Database = require("../utils/database")
const routes = require('./routes/index.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json())

app.listen(config.api.port, async () => {
    console.log(`Server running on port ${config.api.port}`)
    await Database.createTablesIfDoesNotExist();
    console.log('Database connected')
})

app.use("/", routes)

app.use((err, req, res, next) => {
    if (err) {
        if (!err.statusCode) {err.statusCode = 500}
        return res.status(err.statusCode).send({
            statusCode: err.statusCode,
            message: err.message,
            detail: err.details ? {
                message: err.details,
                body: err.details.body ? err.details.body : null,
                params: err.details.params ? err.details.params : null,
            } : null
        })
    }

    next()
})