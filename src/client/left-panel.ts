import $ from "../client/jquery"


const leftPanel = $("body").find("> #app > #left-panel");
const channelList = leftPanel.find("> #channel-list");
const channelListContainer = channelList.find("> #list");
const channelListItemTemplate = channelList.find("> #template >.channel-list-item");


export class ChannelListItem {
    $: JQuery

    constructor(name: string) {
        this.$ = channelListItemTemplate.clone();
        this.$.html(name);

        alphaSortedAppend(this.$);
    }

    setActive() {
        this.$.addClass("selected");
    }

    setInactive() {
        this.$.removeClass("selected");
    }
}


/** Append to the channel list by alphabetical order */
function alphaSortedAppend(item: JQuery) {
    let name = item.text().trim().toLowerCase();
    let target: JQuery;

    let childs = channelListContainer.children(".channel-list-item");

    childs.each( function() {
        let element = $(this);
        let elementName = element.text().trim().toLowerCase();
        target = (name < elementName) ? element : null;
    })

    if (target == null) {
        return channelListContainer.append(item);
    }

    target.before(item);
}
