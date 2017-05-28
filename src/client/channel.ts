import $ from "../client/jquery"
import {ChannelListItem} from "../client/left-panel"
import EventEmitter from "./event-emitter"
import MessageContainer from "../client/message-container"
import {Shema} from "../interface/database"


const events = new EventEmitter();


/**
* Channel events
* key => event's name
* value => args send type
*/
interface Events {
    "open": Channel
    "close": Channel
}


export default class Channel {
    /** Currently selected channel */
    private static selected: Channel = null;

    private container: MessageContainer
    private data: Shema<"channels">
    private item: ChannelListItem

    constructor(channel: Shema<"channels">) {
        this.data = channel;

        this.container = new MessageContainer;
        this.item = new ChannelListItem(channel.name);

        let self = this;
        this.item.$.on("click", function() {
            self.open();
        })
    }

    /** Static - Register an event handler */
    static on <E extends keyof Events> (e: E, cb: (args: Events[E]) => void) {
        events.on(e, cb);
    }

    /** Static - Trigger the event */
    static emit <E extends keyof Events> (e: E, args: Events[E]) {
        events.emit(e, args);
    }


    /** Static - Return the currently selected channel */
    static getSelected() {
        return Channel.selected;
    }

    /** Open the channel */
    open() {
        if (Channel.selected == this) {
            return false;
        }

        if (Channel.selected != null) {
            Channel.selected.close();
        }

        this.item.setActive();
        this.container.open();

        Channel.selected = this;
        Channel.emit("open", this);
    }

    /** Close the channel */
    close() {
        this.item.setInactive();
        this.container.close();
        Channel.emit("close", this);
    }

    /** Get channel ID */
    getID() {
        return this.data.id;
    }

    /** Get channel name */
    getName() {
        return this.data.name;
    }

    /** Add a message */
    addMessage(message: Shema<"messages">) {
        this.container.addMessage(message);
    }
}
