import $ from "../client/jquery"
import Channel from "../client/channel"

const $topbar = $("#app").find("#chat-topbar");
const $channelName = $topbar.find("#channel-name");


// Update the channel name
Channel.on("open", function(chan) {
    $channelName.text(chan.getName());
})
