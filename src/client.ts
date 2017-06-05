import "./client/channel-list"
import "./client/chat-input"
import "./client/chat-topbar"
import "./client/modal-create-channel"
import "./client/user-list"
import Channel from "./client/channel"
import {emit} from "./client/socket"
import User from "./client/user"


async function init() {
    let data = await emit("init", null);

    User.setCurrentUser(data.currentUser);

    data.channels.forEach( function(chan) {
        new Channel(chan);
    })

    data.users.forEach( function(user) {
        new User(user);
    })

    data.online.forEach( function(id) {
        User.get(id).setOnline();
    })
}


init();
