import $ from "../client/jquery"
import {ChannelListItem} from "../client/left-panel"
import {Shema} from "../interface/database"

/** Currently selected channel */
let selected: Channel = null;


export default class Channel {
    item: ChannelListItem

    constructor(channel: Shema<"channels">) {
        let self = this;

        this.item = new ChannelListItem(channel.name);
        this.item.$.on("click", function() {
            self.open();
        })
    }

    /** Open the channel */
    open() {
        if (selected == this) {
            return false;
        }

        this.item.setActive();

        if (selected == null) {
            return selected = this;
        }

        selected.close();
        selected = this;
    }

    /** Close the channel */
    close() {
        this.item.setInactive();
    }
}
