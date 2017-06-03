import $ from "../client/jquery"

const $list = $("#app").find("#user-list");
const $onlineLB = $list.find("#online-lb");
const $offlineLB = $list.find("#offline-lb");
const $onlineNumber = $list.find("#online .number");
const $offlineNumber = $list.find("#offline .number");
const $item = $list.find("#template > .user");


export class UserListItem {
    private $: JQuery
    private $avatar: JQuery
    private $name: JQuery

    constructor(name: string, avatar: string) {
        this.$ = $item.clone();
        this.$avatar = this.$.find(".avatar");
        this.$name = this.$.find(".name");

        this.$avatar.attr("src", avatar);
        this.$name.text(name);

        appendAlphaSorted(this.$, "offline");
    }

    setOnline() {
        appendAlphaSorted(this.$, "online");
    }

    setOffline() {
        appendAlphaSorted(this.$, "offline");
    }
}


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
