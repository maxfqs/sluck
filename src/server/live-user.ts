import * as channel from "../server/channel"
import Database from "../server/database"
import * as user from "../server/user"
import {IO, Socket} from "../interface/socket"

const channelDB = new Database("channels");
const userChanDB = new Database("user-channels");


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
        let members = await channel.getUsersID(chanID);
        LiveUser.toAll( function(user) {
            if (members.indexOf(user.id) > -1) {
                user.joinChannel(chanID);
            }
        })
    }

    /** [ASYNC] Initialize the user */
    async init() {
        if (this.initDone) {
            return true;
        }

        this.channels = await user.getChannelsID(this.id);
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
    joinChannel(chanID: number) {
        if (this.channels.indexOf(chanID) > -1) {
            return false;
        }

        this.channels.push(chanID);
        this.sockets.forEach( function(socket) {
            socket.join("channel" + chanID);
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

    async getChannels() {
        return await channelDB.getByID(this.channels);
    }
}
