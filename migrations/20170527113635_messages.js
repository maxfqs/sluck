exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("messages", function(table) {
        table.increments("id").primary();
        table.integer("user").notNull();
        table.integer("channel").notNull();
        table.text("text", "longtext").notNull();
        table.string("date").notNull();
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("messages");
}
