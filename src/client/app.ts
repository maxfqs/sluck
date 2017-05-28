import "../client/chat-input"
import "../client/chat-topbar"
import Channel from "../client/channel"
import EventEmitter from "../client/event-emitter"
import {Model} from "../interface/client-model"


/**
* App events
* key => event's name
* value => args send type
*/
interface Events {
    "channelCreated": Channel
}


class App {
    private channels: { [id: number] : Channel }
    private events: EventEmitter

    constructor() {
        this.channels = {};
        this.events = new EventEmitter();
    }

    /** Add a channel */
    addChannel(data: Model<"channel">) {
        let id = data.id;
        this.channels[id] = new Channel(data);

        this.emit("channelCreated", this.channels[id]);
    }

    /** Register an event handler */
    on <E extends keyof Events> (e: E, cb: (args: Events[E]) => void) {
        this.events.on(e, cb);
    }

    /** Trigger the event */
    emit <E extends keyof Events> (e: E, args: Events[E]) {
        this.events.emit(e, args);
    }
}


// Singleton
export default new App();
