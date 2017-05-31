import $ from "../client/jquery"
import Channel from "../client/channel"

const $topbar = $("#app").find("#chat-topbar");
const $usersList = $("#app").find("#user-list");
const $channelName = $topbar.find("#channel-name");
const $users = $topbar.find("#users");


// Update the channel name
Channel.on("open", function(chan) {
    $channelName.text(chan.getName());
})

// Open / Close the users list panel
$users.on("click", function() {
    $users.toggleClass("selected");
    $usersList.toggleClass("hide");
})
