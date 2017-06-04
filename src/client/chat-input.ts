import $ from "../client/jquery"
import Channel from "../client/channel"
import {socket, emit} from "../client/socket"
import User from "../client/user"

const $input = $("#app").find("#chat-input");
const $textArea = $input.find("textarea");
const $notification = $input.find(".notification");

// Keep in memory the textArea value between channels
// so we can restore it on chanel opening
let inputValues: { [chanID: number] : string } = {};
// Keep in memory the users ID that are typing between channels
let typings: { [chanID: number] : number[] } = {};
// Keep track of whether or not the user is typing
let isTyping = false;


/** Update and brocast the isTyping variable */
function setTyping(typing: boolean) {
    isTyping = typing;

    emit("userTyping", {
        user: User.getCurrentUser().getID(),
        channel: Channel.getSelected().getID(),
        typing: typing
    })
}

/** Register the message */
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

/** Format and return the typing text for the notification bar */
function getTypingsText(chanID: number) {
    let users = typings[chanID] || [];
    let n = users.length;

    if (n == 0) {
        return "";
    }

    let name = User.get(users[0]).getName();

    if (n == 1) {
        return name + " is typing...";
    }

    if (n == 2) {
        let name2 = User.get(users[1]).getName();
        return name + " and " + name2 + " are typing...";
    }

    if (n > 2) {
        // Remove the name displayed from the others count
        let others = n - 1;
        return name + " and " + others + " others are typing...";
    }
}


// Reset the chat input on page load
$textArea.val("");


$textArea.keyup( function(data) {
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
})


Channel.on("open", function(chan) {
    let chanID = chan.getID();

    // Restore the saved input value
    let val = inputValues[chanID] || "";
    $textArea.val(val);

    // Display who is typing
    $notification.text(getTypingsText(chanID));
})

Channel.on("close", function(chan) {
    let chanID = chan.getID();

    // Save the input value
    inputValues[chanID] = $textArea.val();
})


User.on("disconnect", function(user) {
    let userID = user.getID();

    // Remove that user from all typings since he disconnects
    Object.keys(typings).forEach( function(chanID) {
        let users = typings[chanID];
        let index = users.indexOf(userID);
        if (index > -1) {
            users.splice(index, 1);
            typings[chanID] = users;
        }
    })

    // Update the notification bar
    let chanID = Channel.getSelected().getID();
    $notification.text(getTypingsText(chanID));
})


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

    // Update who is typing
    if (Channel.getSelected().getID() == args.channel) {
        $notification.text(getTypingsText(args.channel));
    }
})
