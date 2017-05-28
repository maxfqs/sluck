import $ from "../client/jquery"

const $channel = $("body").find(">#app >#left-panel >#channel-list");
const $channelList = $channel.find(">#list");
const $channelItem = $channel.find("> #template >.channel-list-item");


class LeftPanelItem {
    $: JQuery

    constructor(item: JQuery) {
        this.$ = item;
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
        super($channelItem.clone());
        this.$.html(name);
        alphaSortedAppend(this.$, $channelList);
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
