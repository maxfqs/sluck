import * as socketIO from "socket.io"
import {Args, Events, RetVal} from "../interface/socket-api"


type OnCallback<T extends Events> = (args: Args<T>, cb: (retal: RetVal<T>)=> void) => void

export interface Socket extends SocketIO.Socket {
    /** User ID */
    userID: number
    on: <T extends Events>(event: T, func: OnCallback<T>) => this
    emit: <T extends Events>(event: T, args: Args<T>, func?: Function) => boolean
    to: (name: string) => this
}
