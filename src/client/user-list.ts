import $ from "../client/jquery"
import User from "../client/user"


const $list = $("#app").find("#user-list");
const $onlineLB = $list.find("#online-lb");
const $offlineLB = $list.find("#offline-lb");
const $onlineNumber = $list.find("#online .number");
const $offlineNumber = $list.find("#offline .number");
const $user = $list.find("#template > .user");


// Create a new user item
User.on("create", function(user) {
    let $item = $user.clone();

    $item.find(".avatar").attr("src", user.getAvatar());
    $item.find(".name").text(user.getName());

    $item.data("id", user.getID());

    appendAlphaSorted($item, "offline");
})


// Handle user connect / disconnect
User.on("connect", function(user) {
    let $item = getByID(user.getID());
    appendAlphaSorted($item, "online");
})

User.on("disconnect", function(user) {
    let $item = getByID(user.getID());
    appendAlphaSorted($item, "offline");
})


/** Return a user item by user ID */
function getByID(userID: number) {
    let $item = $list.find(".user").filter( function() {
        return $(this).data("id") == userID;
    })

    return $item;
}

/** Append to the correct list (online - offline) in alphabetical order */
function appendAlphaSorted($item: JQuery, mode: "online" | "offline") {
    let $lb = (mode == "online") ? $onlineLB : $offlineLB;
    let name = $item.find(".name").text().trim().toLowerCase();
    let $target: JQuery = null;

    $lb.children(".user").each( function() {
        let $child = $(this);
        let childName = $child.find(".name").text().trim().toLowerCase();

        if (name < childName) {
            $target = $child;
            return false;
        }
    })

    if ($target != null) {
        $target.before($item);
    } else {
        $lb.append($item);
    }

    // Update numbers
    $onlineNumber.text( $onlineLB.children(".user").length );
    $offlineNumber.text( $offlineLB.children(".user").length );
}
