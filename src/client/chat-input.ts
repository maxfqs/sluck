import $ from "../client/jquery"
import Channel from "../client/channel"
import {socket, emit} from "../client/socket"
import User from "../client/user"


const $input = $("#app").find("#chat-input");
const $textArea = $input.find("textarea");
const $notification = $input.find(".notification");


$textArea.val(""); // Reset the chat input on page load
$textArea.keyup(onKeyUp);


// Keep in memory the textArea value between channels
// so we can restore it on chanel opening
let cachedVal: { [key: number] : string } = {};

Channel.on("open", function(chan) {
    let val = cachedVal[chan.getID()] || "";
    $textArea.val(val);
    displayTypings(chan.getID());
})

Channel.on("close", function(chan) {
    cachedVal[chan.getID()] = $textArea.val();
})



let isTyping = false;

function setTyping(typing: boolean) {
    isTyping = typing;

    emit("userTyping", {
        user: User.getCurrentUser().getID(),
        channel: Channel.getSelected().getID(),
        typing: typing
    })
}

function onKeyUp(data) {
    let text: string = $textArea.val().trim();

    // User deleted his message.
    // Broadcast that he is no longer typing.
    if (text.length == 0 && isTyping) {
        return setTyping(false);
    }

    // Register the message
    if (data.key == "Enter" && !data.shiftKey) {
        let success = registerMessage(text);
        if (success) {
            $textArea.val("");
            setTyping(false);
        }
        return;
    }

    if (!isTyping) {
        setTyping(true);
    }
}


function registerMessage(text: string) {
    if (text == "") {
        return false;
    }

    emit("registerMessage", {
        channel: Channel.getSelected().getID(),
        text: text
    })

    return true;
}


let typings: {[id: number] : number[]} = {};

function displayTypings(chanID: number) {
    let users = typings[chanID] || [];

    if (users.length == 0) {
        $notification.text("");
        return;
    }

    let text = "";

    users.forEach( function(id) {
        text = text + User.get(id).getName();
    })

    $notification.text(text);
}


socket.on("userTyping", function(args) {
    if (User.isCurrentUser(args.user)) {
        return false;
    }

    // Update the typings cache
    let users = typings[args.channel] || [];

    if (args.typing) {
        users.push(args.user);
    } else {
        let index = users.indexOf(args.user);
        if (index > -1) {
            users.splice(index, 1);
        }
    }

    typings[args.channel] = users;

    if (Channel.getSelected().getID() == args.channel) {
        displayTypings(args.channel);
    }
})
