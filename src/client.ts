import "./client/chat-input"
import "./client/chat-topbar"
import "./client/modal-create-channel"
import Channel from "./client/channel"
import {emit} from "./client/socket"
import User from "./client/user"


async function init() {
    let data = await emit("init", null);

    data.channels.forEach( function(chan) {
        new Channel(chan);
    })

    data.users.forEach( function(user) {
        new User(user);
    })
}


init();
