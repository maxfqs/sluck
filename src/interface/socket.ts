import * as socketIO from "socket.io"

export interface Socket extends SocketIO.Socket {
    /** User ID */
    userID: number
}
