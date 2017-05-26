// Validation before starting the script
require("./valid-install");

const config = require("../config/sluck.json");
const mysql = require("mysql");
const shell = require("shelljs");


const db = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    user: config.mysqlUser,
    password: config.mysqlPassword
})

db.query("drop database if exists sluck; create database sluck", onDatabaseCreated);


function onDatabaseCreated(error) {
    if (error) {
        console.error(error);
        process.exit();
    }

    db.end();
}
