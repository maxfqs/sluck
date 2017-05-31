import * as channel from "../server/channel"
import Database from "../server/database"
import * as user from "../server/user"
import {Socket} from "../interface/socket"

const channelDB = new Database("channels");
const userChanDB = new Database("user-channels");


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

        this.sockets.push(socket);
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
