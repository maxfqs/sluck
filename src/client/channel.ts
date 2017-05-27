import $ from "../client/jquery"
import {ChannelListItem} from "../client/left-panel"
import * as chat from "../client/chat"
import {Shema} from "../interface/database"

/** Currently selected channel */
let selected: Channel = null;


export default class Channel {
    data: Shema<"channels">
    item: ChannelListItem

    constructor(channel: Shema<"channels">) {
        let self = this;

        this.data = channel;

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

        if (selected != null) {
            selected.close();
        }

        chat.openChannel(this.data.name);
        this.item.setActive();

        selected = this;
    }

    /** Close the channel */
    close() {
        this.item.setInactive();
    }
}