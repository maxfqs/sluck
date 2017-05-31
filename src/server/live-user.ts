import Database from "../server/database"
import * as user from "../server/user"
import {Socket} from "../interface/socket"

const channelDB = new Database("channels");


export default class LiveUser {
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

        this.sockets.push(socket);
    }


    setOnline() {
        if (this.online) {
            return false;
        }

        this.online = true;
    }

    async getChannels() {
        return await channelDB.getByID(this.channels);
    }
}
