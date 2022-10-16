const knex = require('./knex');

class Database {
    static async createTablesIfDoesNotExist() {
        await checkTables()
    }
}

async function checkTables() {

    if (!await knex.schema.hasTable("user")) {
        await knex.schema.createTable("user", (table) => {
            table.increments("id").primary();
            table.string("name", 100).notNullable();
        })
    }
    if (!await knex.schema.hasTable("book")) {
        await knex.schema.createTable("book", (table) => {
            table.increments("id").primary();
            table.string("name", 100).notNullable();
        })
    }
    if (!await knex.schema.hasTable("borrow")) {
        await knex.schema.createTable("borrow", (table) => {
            table.increments("id").primary();
            table.integer("bookId").references("id").inTable("book").onDelete('CASCADE').notNullable();
            table.integer("userId").references("id").inTable("user").onDelete('CASCADE').notNullable();
            table.integer("status").notNullable();
            // table.dateTime("borrowingDate").notNullable();
            // table.dateTime("returningDate").nullable();
        })
    }
    if (!await knex.schema.hasTable("return")) {
        await knex.schema.createTable("return", (table) => {
            table.increments("id").primary();
            table.integer("bookId").references("id").inTable("book").onDelete('CASCADE').notNullable();
            table.integer("userId").references("id").inTable("user").onDelete('CASCADE').notNullable();
            table.integer("userScore").notNullable();
        })
    }
}

module.exports = Database;
