const shell = require("shelljs");

// config file
if (!shell.test("-e", "config/sluck.json")) {
    console.log("Error: config/sluck.json doesn't exit");
    process.exit();
}

// temp sass folder
if (!shell.test("-e", "script/sass")) {
    shell.mkdir("script/sass");
}
