import Database from "../server/database"
import * as user from "../server/user"
import {Socket} from "../interface/socket"

const channelDB = new Database("channels");

let cached: {[id: number] : LiveUser} = {};


export default class LiveUser {
    private channels: number[]
    private id: number
    private initDone: boolean
    private online: boolean
    private sockets: Socket[]

    constructor(socket: Socket) {
        let id = socket.userID;

        // User already created
        // register the socket and return
        // the cached user
        if (cached[id] != null) {
            let user = cached[id];
            user.addSocket(socket);
            return user;
        }

        this.channels = [];
        this.id = id;
        this.initDone = false;
        this.online = false;
        this.sockets = [];

        cached[id] = this;

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

    setOnline() {
        if (this.online) {
            return false;
        }

        this.online = true;
    }

    addSocket(socket: Socket) {
        this.sockets.push(socket);
    }

    async getChannels() {
        return await channelDB.getByID(this.channels);
    }
}
