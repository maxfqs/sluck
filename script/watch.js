require("./build.js");

const shell = require("shelljs");
const watcher = require("filewatcher")();


shell.exec("webpack --watch ./lib/client.js ./public/sluck.js", {async:true});
shell.exec("webpack --watch ./lib/client-account.js ./public/account.js", {async:true});

shell.exec("nodemon --delay 0.3 --config config/nodemon.json lib/server.js", {async: true});

shell.exec("sass --sourcemap=none --watch views/style.scss:script/sass/style.css", {async: true});

// We look for change on this temp style.css to trigger the postcss
watcher.add("script/sass/style.css");
watcher.on("change", function(file, state) {
    if (!state) {
        return false;
    }

    shell.exec("postcss --no-map --use autoprefixer -o public/style.css " + file);
})
