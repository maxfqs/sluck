import App from "./client/app"
import {emit} from "./client/socket"


async function init() {
    let data = await emit("init", null);

    data.channels.forEach( function(channel) {
        App.addChannel(channel);
    })

    data.users.forEach( function(user) {
        App.addUser(user);
    })
}


init();
