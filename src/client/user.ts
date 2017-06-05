import EventEmitter from "./event-emitter"
import {Model} from "../interface/client-model"
import {emit, socket} from "../client/socket"

const events = new EventEmitter();


/**
* User events
* key => event's name
* value => args send type
*/
interface Events {
    "create": User
    "connect": User
    "disconnect": User
}


export default class User {
    private static currentUser: number = null;
    private static users: { [id: number] : User } = {};
    private data: Model<"user">
    private online: boolean

    constructor(data: Model<"user">) {
        this.data = data;
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

    /**
    * Static - Set the current user ID
    * Can only be set once
    */
    static setCurrentUser(id: number) {
        User.currentUser = User.currentUser || id;
    }

    static isCurrentUser(id: number) {
        return User.currentUser == id;
    }

    static getCurrentUser() {
        return User.users[User.currentUser];
    }

    /** Static - Return a user by id */
    static get(userID: number) {
        return User.users[userID];
    }

    getAvatar() {
        return "private/avatar/" + this.data.avatar;
    }

    getID() {
        return this.data.id;
    }

    /** Return the user name */
    getName() {
        return this.data.login;
    }

    setOnline() {
        this.online = true;
        User.emit("connect", this);
    }

    setOffline() {
        this.online = false;
        User.emit("disconnect", this);
    }
}


socket.on("userConnected", async function(id) {
    let user = User.get(id);

    if (user != null) {
        return user.setOnline();
    }

    // User unknown, create it and set him online
    let data = await emit("getUser", id);
    new User(data).setOnline();
})

socket.on("userDisconnected", function(id) {
    User.get(id).setOffline();
})
