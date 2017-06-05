import EventEmitter from "./event-emitter"
import MessageContainer from "../client/message-container"
import {Model} from "../interface/client-model"
import {socket} from "../client/socket"

const events = new EventEmitter();


/**
* Channel events
* key => event's name
* value => args send type
*/
interface Events {
    "create": Channel
    "open": Channel
    "close": Channel
}


export default class Channel {
    private static channels: { [id: number] : Channel } = {};
    private static selected: Channel = null;
    private data: Model<"channel">
    private container: MessageContainer

    constructor(data: Model<"channel">) {
        this.data = data;
        this.container = new MessageContainer(data.id);

        Channel.channels[data.id] = this;
        Channel.emit("create", this);
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

    /** Static - Return a channel by id */
    static get(chanID: number) {
        return Channel.channels[chanID];
    }

    /** Open the channel */
    open() {
        if (Channel.selected == this) {
            return false;
        }

        if (Channel.selected != null) {
            Channel.selected.close();
        }

        this.container.open();

        Channel.selected = this;
        Channel.emit("open", this);
    }

    /** Close the channel */
    close() {
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

    isType(type: Model<"channel">["type"]) {
        return this.data.type == type;
    }
}


socket.on("newChannel", function(chan) {
    new Channel(chan);
})
