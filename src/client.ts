import Channel from "./client/channel"
import * as socket from "./client/socket"


async function init() {
    let data = await socket.emit("init", null);

    data.channels.forEach( function(channel) {
        new Channel(channel);
    })
}

init();
