import $ from "../client/jquery"

const $list = $("#app").find("#user-list");
const $item = $list.find("#template > .user");


export default class UserListItem {
    private $: JQuery

    constructor(name: string) {
        this.$ = $item.clone();
        this.$.find(".name").text(name);
        $list.append(this.$);
    }

    setOnline() {
        this.$.addClass("online");
    }
}
