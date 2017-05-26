const config = require("./config/sluck.json");

module.exports = {
    development: {
        client: "mysql",
        connection: {
            host: "localhost",
            user: config.mysqlUser,
            password: config.mysqlPassword,
            database: "sluck"
        }
    }
}
