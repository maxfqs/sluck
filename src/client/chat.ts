import $ from "../client/jquery"
import {emit, socket} from "../client/socket"

const chat = $("body").find("> #app > #chat");
const channelName = chat.find("> #topbar > #channel-name");
const channelContent = chat.find("> #channel-content");
const input = chat.find("> #input > textarea");

export function openChannel(name: string) {
    channelName.text(name);
}

function registerMessage() {
    let val = input.val();
    if (val == "") {
        return false;
    }

    emit("registerMessage", {channel: 1, text: val});
}


input.keypress( function(data) {
    if (data.key == "Enter") {
        registerMessage();
        return false;
    }
})

socket.on("newMessage", function(message) {
    channelContent.append("<p>" + message.text + "</p>");
})
