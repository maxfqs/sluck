import * as clientModel from "../server/client-model"
import {IO, Socket} from "../interface/socket"
import {Model} from "../interface/client-model"


export default class LiveUser {
    private static io: IO = null;
    private static users: {[id: number] : LiveUser} = {};
    private channels: number[]
    private id: number
    private initDone: boolean
    private online: boolean
    private sockets: Socket[]

    constructor(id: number) {
        // User already created
        // return the cached user
        if (LiveUser.users[id] != null) {
            return LiveUser.users[id];
        }

        this.channels = [];
        this.id = id;
        this.initDone = false;
        this.online = false;
        this.sockets = [];

        LiveUser.users[id] = this;
        this.setOnline();
    }

    /** Static - Register the server io object */
    static registerIO(io: IO) {
        LiveUser.io = io;
    }

    /** Static - Apply the callback to all users */
    static toAll(cb: (user: LiveUser) => void) {
        Object.keys(LiveUser.users).forEach( function(key) {
            let user = LiveUser.users[Number(key)];
            cb(user);
        })
    }

    /** Make all the users concerned join that channel */
    static async addChannel(chanID: number) {
        let chan = await clientModel.getChannelByID(chanID);

        LiveUser.toAll( function(user) {
            if (chan.members.indexOf(user.id) > -1) {
                user.joinChannel(chan);
            }
        })
    }

    /** Return the ids of all online users */
    static getOnlineUsersID() {
        let ids: number[] = [];
        LiveUser.toAll( function(user) {
            ids.push(user.id);
        })
        return ids;
    }

    /** [ASYNC] Initialize the user */
    async init() {
        if (this.initDone) {
            return true;
        }

        this.channels = await clientModel.getUserChannelsID(this.id);
        this.initDone = true;
    }

    /** Register a socket */
    registerSocket(socket: Socket) {
        this.channels.forEach( function(chanID) {
            socket.join("channel" + chanID);
        })

        socket.join("all");
        this.sockets.push(socket);
    }

    /** Remove a socket */
    removeSocket(socket: Socket) {
        let index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);
    }

    /** Add the user to that channel */
    joinChannel(chan: Model<"channel">) {
        if (this.channels.indexOf(chan.id) > -1) {
            return false;
        }

        this.channels.push(chan.id);
        this.sockets.forEach( function(socket) {
            socket.join("channel" + chan.id);
            socket.emit("newChannel", chan);
        })
    }

    /** Set user online */
    setOnline() {
        if (this.online) {
            return false;
        }

        this.online = true;
        LiveUser.io.to("all").emit("userConnected", this.id);
    }

    /** Set user offline */
    setOffline(socket: Socket) {
        if (!this.online) {
            return false;
        }

        // User has more then one socket opened
        // do not set him offline
        if(this.sockets.length > 1){
            this.removeSocket(socket);
            return false;
        }

        // Broadcast the change and remove from the cached users
        LiveUser.io.to("all").emit("userDisconnected", this.id);
        delete LiveUser.users[this.id];
    }

    getChannelsID() {
        return this.channels;
    }
}
