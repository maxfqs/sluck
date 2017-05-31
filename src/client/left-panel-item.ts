import $ from "../client/jquery"

const $channel = $("#app").find("#channel-list");
const $list = $channel.find("#channel-lb");
const $item = $channel.find("#template >.item");


class LeftPanelItem {
    $: JQuery
    name: JQuery

    constructor(item: JQuery) {
        this.$ = item;
        this.name = item.find(".name");
    }

    setActive() {
        this.$.addClass("selected");
    }

    setInactive() {
        this.$.removeClass("selected");
    }
}


export class ChannelItem extends LeftPanelItem {
    constructor(name: string) {
        super($item.clone());
        this.setName(name);
        alphaSortedAppend(this.$, $list);
    }

    setName(name: string) {
        this.name.text(name);
    }
}


/** Append to the list by alphabetical order */
function alphaSortedAppend(item: JQuery, list: JQuery) {
    let name = item.text().trim().toLowerCase();
    let target: JQuery = null;

    let childs = list.children(".channel-list-item");

    childs.each( function() {
        let element = $(this);
        let elementName = element.text().trim().toLowerCase();

        if (name < elementName) {
            target = element;
            return false;
        }
    })

    if (target == null) {
        return list.append(item);
    }

    target.before(item);
}
