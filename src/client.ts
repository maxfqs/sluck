import Channel from "./client/channel"
import {emit} from "./client/socket"


async function init() {
    let data = await emit("init", null);

    data.channels.forEach( function(channel) {
        new Channel(channel);
    })
}

init();
