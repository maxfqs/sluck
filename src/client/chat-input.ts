import $ from "../client/jquery"
import Channel from "../client/channel"
import {emit} from "../client/socket"

const $input = $("#app").find("#chat-input");
const $textArea = $input.find("textarea");


// Reset the chat input on page load
$textArea.val("");

// Keep in memory the textArea value between channels
// so we can restore it on chanel opening
let cachedVal: { [key: number] : string } = {};

Channel.on("open", function(chan) {
    let val = cachedVal[chan.getID()] || "";
    $textArea.val(val);
})

Channel.on("close", function(chan) {
    cachedVal[chan.getID()] = $textArea.val();
})


function registerMessage() {
    let text = $textArea.val().trim();
    if (text == "") {
        return false;
    }

    let chanID = Channel.getSelected().getID();
    emit("registerMessage", {channel: chanID, text: text});

    $textArea.val("");
}

$textArea.keypress( function(data) {
    if (data.key == "Enter" && !data.shiftKey) {
        registerMessage();
        return false;
    }
})
