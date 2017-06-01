import EventEmitter from "./event-emitter"
import {Model} from "../interface/client-model"
import {socket} from "../client/socket"
import UserListItem from "../client/user-list-item"

const events = new EventEmitter();


/**
* User events
* key => event's name
* value => args send type
*/
interface Events {
    "create": User
}


export default class User {
    private static users: { [id: number] : User } = {};
    private data: Model<"user">
    private item: UserListItem
    private online: boolean

    constructor(data: Model<"user">) {
        this.data = data;
        this.item = new UserListItem(data.login);
        this.online = false;

        User.users[data.id] = this;
        User.emit("create", this);
    }

    /** Static - Register an event handler */
    static on <E extends keyof Events> (e: E, cb: (args: Events[E]) => void) {
        events.on(e, cb);
    }

    /** Static - Trigger the event */
    static emit <E extends keyof Events> (e: E, args: Events[E]) {
        events.emit(e, args);
    }

    /** Static - Return a user by id */
    static get(userID: number) {
        return User.users[userID];
    }

    getID() {
        return this.data.id;
    }

    /** Return the user name */
    getName() {
        return this.data.login;
    }

    setOnline() {
        this.item.setOnline();
        this.online = true;
    }
}


socket.on("userConnected", function(id) {
    User.get(id).setOnline();
})
