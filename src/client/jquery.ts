// Jquery is loaded by cdn but we declare it here so we can use typescript
import * as jquery from "jquery"

declare const $:JQueryStatic
export default $


// Small override to log an error if nothing is find
let find = $.fn.find;
$.fn.find = function() {
    let result = find.apply(this, arguments);
    if (result.length == 0) {
        console.error("Jquery: cannot find " + arguments[0]);
    }

    return result;
}
