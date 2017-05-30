import "../client/chat-input"
import "../client/chat-topbar"
import "../client/modal-create-channel"
import Channel from "../client/channel"
import EventEmitter from "../client/event-emitter"
import {Model} from "../interface/client-model"
import User from "../client/user"


class App {
    constructor() {}

    /** Add a channel */
    addChannel(data: Model<"channel">) {
        new Channel(data);
    }

    /** Add a user */
    addUser(data: Model<"user">) {
        new User(data);
    }
}


// Singleton
export default new App();
