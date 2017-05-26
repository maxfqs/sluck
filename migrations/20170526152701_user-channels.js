exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("user-channels", function(table) {
        table.increments("id").primary();
        table.integer("user").notNull();
        table.integer("channel").notNull();
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("user-channels");
}
