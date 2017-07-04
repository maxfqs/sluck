import EventEmitter from "./event-emitter"
import MessageContainer from "../client/message-container"
import User from "../client/user"
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
    private static direct: { [userID: number] : Channel } = {};
    private static personal: Channel = null;
    private static selected: Channel = null;
    private data: Model<"channel">
    private container: MessageContainer

    constructor(data: Model<"channel">) {
        this.data = data;
        this.container = new MessageContainer(data.id);

        if (this.isType("personal")) {
            Channel.personal = this;
        }

        // Register to the direct channel list by interlocutor's id
        if (this.isType("direct")) {
            let userID: number;

            this.data.members.forEach( function(id) {
                if (id != User.getCurrentUser().getID()) {
                    userID = id;
                }
            })

            Channel.direct[userID] = this;
        }


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

    /** Static - Return the personal channel */
    static getPersonal() {
        return Channel.personal;
    }

    /** Static - Return the direct channel for that user */
    static getDirect(userID: number) {
        return Channel.direct[userID];
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
            return;
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

    /** Get channel members (users id) */
    getMembers() {
        return this.data.members;
    }

    /** Return the interlocutor user ID of a direct channel */
    getInterlocutorID() {
        let retval: number;
        this.data.members.forEach( function(id) {
            if (User.getCurrentUser().getID() != id) {
                retval = id;
            }
        })

        return retval;
    }

    /** Return the channel topic */
    getTopic() {
        return this.data.topic || "Add a topic";
    }

    /** Check the channel's type */
    isType(type: Model<"channel">["type"]) {
        return this.data.type == type;
    }
}


socket.on("newChannel", function(chan) {
    new Channel(chan);
})
