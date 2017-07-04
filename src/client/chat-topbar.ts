import $ from "../client/jquery"
import Channel from "../client/channel"
import User from "../client/user"


const $topbar = $("#app").find("#chat-topbar");
const $usersList = $("#app").find("#user-list");
const $channelName = $topbar.find("#channel-info .name");
const $channelTopic = $topbar.find("#channel-info .topic");
const $users = $topbar.find("#users");


// Update the channel info
Channel.on("open", function(chan) {
    let name = "";
    let topic = "";

    if (chan.isType("public")) {
        name = chan.getName();
        topic = chan.getTopic();
    }

    if (chan.isType("personal")) {
        name = User.getCurrentUser().getName();
        topic = "Personal channel";
    }

    if (chan.isType("direct")) {
        let userID = chan.getInterlocutorID();
        name = User.get(userID).getName();
        topic = "Direct conversation";
    }

    $channelName.text(name);
    $channelTopic.text(topic);
})

// Open / Close the users list panel
$users.on("click", function() {
    $users.toggleClass("selected");
    $usersList.toggleClass("hide");
})
