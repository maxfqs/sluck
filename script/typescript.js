const config = require("../src/tsconfig.json");
const shell = require("shelljs");

const target = config.compilerOptions.target;
const lib = parseLib();


exports.compile = function(file, dir) {
    shell.exec("tsc " + file + " --outDir " + dir + " -target " + target + " -lib " + lib);
}


function parseLib() {
    let libArray = config.compilerOptions.lib;
    let retval = "";

    libArray.forEach( function(lib) {
        retval = retval + lib + ",";
    })

    // Remove the last comma
    retval = retval.substring(0, retval.length - 1);
    return retval;
}
