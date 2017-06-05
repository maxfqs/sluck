import $ from "../client/jquery"
import Channel from "../client/channel"
import User from "../client/user"


const $topbar = $("#app").find("#chat-topbar");
const $usersList = $("#app").find("#user-list");
const $channelName = $topbar.find("#channel-name");
const $users = $topbar.find("#users");


// Update the channel name
Channel.on("open", function(chan) {
    let name = "";

    if (chan.isType("public")) {
        name = chan.getName();
    }

    if (chan.isType("personal")) {
        name = User.getCurrentUser().getName();
    }

    $channelName.text(name);
})

// Open / Close the users list panel
$users.on("click", function() {
    $users.toggleClass("selected");
    $usersList.toggleClass("hide");
})
