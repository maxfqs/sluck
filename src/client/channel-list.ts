import $ from "../client/jquery"
import Channel from "../client/channel"


const $channelList = $("#app").find("#channel-list");
const $list = $channelList.find("#channel-lb");
const $chan = $channelList.find("#template .channel");


// Create a new channel item
Channel.on("create", function(chan) {
    // Ignore direct and personal channel
    if (!chan.isType("public")) {
        return false;
    }

    let $item = $chan.clone();
    $item.find(".name").text(chan.getName());

    $item.data("id", chan.getID());
    $item.on("click", function() {
        chan.open();
    })

    appendAlphaSorted($item);
})

/** Toggle the selected class on open - close events */
function toggleSelected(chan: Channel) {
    if (!chan.isType("public")) {
        return false;
    }

    let $item = getByID(chan.getID());
    $item.toggleClass("selected");
}

Channel.on("open", toggleSelected);
Channel.on("close", toggleSelected);


/** Return a channel item by channel ID */
function getByID(chanID: number) {
    let $item = $list.find(".channel").filter( function() {
        return $(this).data("id") == chanID;
    })

    return $item;
}

/** Append to the channel list by alphabetical order */
function appendAlphaSorted($item: JQuery) {
    let name = $item.text().trim().toLowerCase();
    let $target: JQuery = null;

    let childs = $list.children(".channel");

    childs.each( function() {
        let $element = $(this);
        let elementName = $element.text().trim().toLowerCase();

        if (name < elementName) {
            $target = $element;
            return false;
        }
    })

    if ($target == null) {
        return $list.append($item);
    }

    $target.before($item);
}
