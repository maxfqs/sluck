import "./client/chat-input"
import "./client/chat-topbar"
import Channel from "./client/channel"
import {socket, emit} from "./client/socket"

let channels: {[key: number] : Channel} = {};



async function init() {
    let data = await emit("init", null);

    data.channels.forEach( function(channel) {
        channels[channel.id] = new Channel(channel);
    })
}

init();


socket.on("newMessage", function(message) {
    let chanID = message.channel;
    channels[chanID].addMessage(message);
})
