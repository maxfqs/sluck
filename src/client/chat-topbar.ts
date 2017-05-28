import $ from "../client/jquery"
import Channel from "../client/channel"

const $topbar = $("body").find(">#app >#chat >#topbar");
const $channelName = $topbar.find(">#channel-name");


// Update the channel name
Channel.on("open", function(chan) {
    $channelName.text(chan.getName());
})
