exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("users", function(table) {
        table.increments("id").primary();
        table.string("login").notNull().unique();
        table.string("password").notNull();
        table.string("avatar").defaultTo("default.png");
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("users");
}
