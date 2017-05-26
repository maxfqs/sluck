// Validation before starting the script
require("./valid-install");

const shell = require("shelljs");
const tsc = require("./typescript");


tsc.compile("src/server.ts", "lib");
tsc.compile("src/client.ts", "lib");
tsc.compile("src/client-account.ts", "lib");

shell.exec("webpack --config config/webpack.config.js ./lib/client.js ./public/sluck.js");
shell.exec("webpack --config config/webpack.config.js ./lib/client-account.js ./public/account.js");

shell.exec("sass views/style.scss:public/style.css --sourcemap=none --style compressed");
shell.exec("postcss --no-map --use autoprefixer -o public/style.css public/style.css");

shell.exec("knex migrate:latest");
