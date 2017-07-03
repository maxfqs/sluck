import "./client/channel-list"
import "./client/chat-input"
import "./client/chat-topbar"
import "./client/modal-create-channel"
import "./client/user-list"
import $ from "./client/jquery"
import Channel from "./client/channel"
import {emit} from "./client/socket"
import User from "./client/user"


async function init() {
    let data = await emit("init", null);

    User.setCurrentUser(data.currentUser);

    data.users.forEach( function(user) {
        new User(user);
    })

    data.channels.forEach( function(chan) {
        new Channel(chan);
    })

    data.online.forEach( function(id) {
        User.get(id).setOnline();
    })


    let userName = User.getCurrentUser().getName();
    $("#app").find("#user-setting .name").text(userName);
}


init();
