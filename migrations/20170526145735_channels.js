exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("channels", function(table) {
        table.increments("id").primary();
        table.string("name").unique();
        table.string("type").defaultTo("public");
        table.boolean("auto_join").defaultTo(false);
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("channels");
}
